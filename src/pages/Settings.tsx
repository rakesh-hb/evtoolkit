import {
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

import {
  createBackup,
  restoreBackup,
} from "../services/backupService";


interface FamilyMember {
  family_id: string;
  family_name: string;
  member_id: number;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}


interface FamilyInvitation {
  id: string;
  family_id: string;
  family_name: string;
  email: string;
  role: string;
  invited_by: string;
  status: string;
  created_at: string;
  expires_at: string;
}


interface InvitableUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}


function Settings() {
  const [currency, setCurrency] =
    useState("INR (₹)");

  const [tariff, setTariff] =
    useState(7);

  const [distanceUnit, setDistanceUnit] =
    useState("km");


  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [currentUserEmail, setCurrentUserEmail] =
    useState("");


  const [familyMembers, setFamilyMembers] =
    useState<FamilyMember[]>([]);

  const [invitations, setInvitations] =
    useState<FamilyInvitation[]>([]);

  const [invitableUsers, setInvitableUsers] =
    useState<InvitableUser[]>([]);


  const [searchText, setSearchText] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState<InvitableUser | null>(null);


  const [loadingFamily, setLoadingFamily] =
    useState(true);

  const [sendingInvitation, setSendingInvitation] =
    useState(false);

  const [acceptingInvitationId, setAcceptingInvitationId] =
    useState<string | null>(null);

  const [removingMemberId, setRemovingMemberId] =
    useState<number | null>(null);


  const fileInputRef =
    useRef<HTMLInputElement>(null);


  /*
   * ============================================================
   * LOAD FAMILY DATA
   * ============================================================
   */

  useEffect(() => {
    void loadFamilyData();
  }, []);


  async function loadFamilyData() {
    setLoadingFamily(true);

    try {
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();


      if (userError) {
        throw userError;
      }


      const user =
        userData.user;


      if (!user?.id) {
        throw new Error(
          "Authentication required."
        );
      }


      setCurrentUserId(
        user.id
      );

      setCurrentUserEmail(
        user.email ?? ""
      );


      /*
       * Family members
       */

      const {
        data: membersData,
        error: membersError,
      } = await supabase.rpc(
        "get_my_family_members"
      );


      if (membersError) {
        throw membersError;
      }


      setFamilyMembers(
        (membersData ??
          []) as FamilyMember[]
      );


      /*
       * Family invitations
       */

      const {
        data: invitationsData,
        error: invitationsError,
      } = await supabase.rpc(
        "get_my_family_invitations"
      );


      if (invitationsError) {
        throw invitationsError;
      }


      setInvitations(
        (invitationsData ??
          []) as FamilyInvitation[]
      );


      /*
       * Registered users
       * available for invitation.
       */

      const {
        data: usersData,
        error: usersError,
      } = await supabase.rpc(
        "get_invitable_users"
      );


      if (usersError) {
        throw usersError;
      }


      setInvitableUsers(
        (usersData ??
          []) as InvitableUser[]
      );

    } catch (error) {
      console.error(
        "Family settings load error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to load family information."
      );

    } finally {
      setLoadingFamily(false);
    }
  }


  /*
   * ============================================================
   * FAMILY
   * ============================================================
   */

  const family =
    familyMembers.length > 0
      ? familyMembers[0]
      : null;


  const isFamilyOwner =
    family !== null &&
    family.user_id ===
      currentUserId &&
    family.role ===
      "owner";


  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  function normalizeEmail(
    email: string
  ) {
    return email
      .trim()
      .toLowerCase();
  }


  function isAlreadyFamilyMember(
    email: string
  ) {
    const normalizedEmail =
      normalizeEmail(
        email
      );


    return familyMembers.some(
      (member) =>
        normalizeEmail(
          member.email
        ) === normalizedEmail
    );
  }


  function getPendingInvitation(
    email: string
  ) {
    const normalizedEmail =
      normalizeEmail(
        email
      );


    return invitations.find(
      (invitation) =>
        invitation.family_id ===
          family?.family_id &&
        invitation.status ===
          "pending" &&
        normalizeEmail(
          invitation.email
        ) === normalizedEmail
    );
  }


  /*
   * ============================================================
   * FILTER INVITABLE USERS
   * ============================================================
   *
   * Search:
   *   - first name
   *   - last name
   *   - email
   *
   * Also exclude:
   *   - current family members
   *   - users with pending invitations
   */

  const normalizedSearch =
    searchText
      .trim()
      .toLowerCase();


  const availableUsers =
    invitableUsers.filter(
      (user) => {

        if (
          isAlreadyFamilyMember(
            user.email
          )
        ) {
          return false;
        }


        if (
          getPendingInvitation(
            user.email
          )
        ) {
          return false;
        }


        if (
          !normalizedSearch
        ) {
          return true;
        }


        const firstName =
          (
            user.first_name ??
            ""
          ).toLowerCase();

        const lastName =
          (
            user.last_name ??
            ""
          ).toLowerCase();

        const email =
          (
            user.email ??
            ""
          ).toLowerCase();


        const fullName =
          `${firstName} ${lastName}`
            .trim()
            .toLowerCase();


        return (
          firstName.includes(
            normalizedSearch
          ) ||
          lastName.includes(
            normalizedSearch
          ) ||
          email.includes(
            normalizedSearch
          ) ||
          fullName.includes(
            normalizedSearch
          )
        );
      }
    );


  /*
   * ============================================================
   * INVITE MEMBER
   * ============================================================
   */

  async function handleInvite() {
    if (!isFamilyOwner) {
      alert(
        "Only the family owner can invite members."
      );

      return;
    }


    if (!family?.family_id) {
      alert(
        "Family information is not available."
      );

      return;
    }


    if (!selectedUser) {
      alert(
        "Please select a family member."
      );

      return;
    }


    const email =
      normalizeEmail(
        selectedUser.email
      );


    if (
      isAlreadyFamilyMember(
        email
      )
    ) {
      alert(
        "This user is already a member of your family."
      );

      return;
    }


    if (
      getPendingInvitation(
        email
      )
    ) {
      alert(
        "An invitation is already pending for this user."
      );

      return;
    }


    setSendingInvitation(
      true
    );


    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "create_family_invitation",
        {
          p_family_id:
            family.family_id,

          p_email:
            email,

          p_role:
            "member",
        }
      );


      if (error) {
        throw error;
      }


      console.log(
        "Family invitation created:",
        data
      );


      alert(
        `Invitation sent to ${email}.`
      );


      setSearchText(
        ""
      );

      setSelectedUser(
        null
      );


      await loadFamilyData();

    } catch (error) {
      console.error(
        "Family invitation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to send family invitation."
      );

    } finally {
      setSendingInvitation(
        false
      );
    }
  }


  /*
   * ============================================================
   * ACCEPT INVITATION
   * ============================================================
   */

  async function handleAcceptInvitation(
    invitationId: string
  ) {
    if (
      acceptingInvitationId
    ) {
      return;
    }


    setAcceptingInvitationId(
      invitationId
    );


    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        "accept_family_invitation",
        {
          p_invitation_id:
            invitationId,
        }
      );


      if (error) {
        throw error;
      }


      console.log(
        "Family invitation accepted:",
        data
      );


      alert(
        "Family invitation accepted successfully."
      );


      await loadFamilyData();

    } catch (error) {
      console.error(
        "Accept invitation error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to accept family invitation."
      );

    } finally {
      setAcceptingInvitationId(
        null
      );
    }
  }


  /*
   * ============================================================
   * REMOVE MEMBER
   * ============================================================
   */

  async function handleRemoveMember(
    member: FamilyMember
  ) {
    if (!isFamilyOwner) {
      return;
    }


    if (
      member.user_id ===
      currentUserId
    ) {
      alert(
        "The family owner cannot remove themselves."
      );

      return;
    }


    const confirmed =
      window.confirm(
        `Remove ${member.email} from the family?`
      );


    if (!confirmed) {
      return;
    }


    setRemovingMemberId(
      member.member_id
    );


    try {
      const {
        error,
      } = await supabase
        .from("family_members")
        .delete()
        .eq(
          "id",
          member.member_id
        )
        .eq(
          "family_id",
          member.family_id
        );


      if (error) {
        throw error;
      }


      alert(
        `${member.email} has been removed from the family.`
      );


      await loadFamilyData();

    } catch (error) {
      console.error(
        "Remove family member error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove family member."
      );

    } finally {
      setRemovingMemberId(
        null
      );
    }
  }


  /*
   * ============================================================
   * BACKUP / RESTORE
   * ============================================================
   */

  async function handleRestore(
    file: File
  ) {
    try {
      await restoreBackup(
        file
      );

    } catch (err: any) {
      console.error(
        "Backup restore error:",
        err
      );

      alert(
        err?.message ||
          "Unable to restore backup. Please check the browser console for details."
      );

    } finally {
      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }
    }
  }


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <div className="welcome">

        <h2>
          ⚙️ Settings
        </h2>

        <p>
          Customize your EV Toolkit
          preferences.
        </p>

      </div>


      {/* ======================================================
          GENERAL SETTINGS
          ====================================================== */}

      <div className="card">

        <label>
          Currency
        </label>

        <select
          value={
            currency
          }
          onChange={(e) =>
            setCurrency(
              e.target.value
            )
          }
        >
          <option>
            INR (₹)
          </option>
        </select>


        <label>
          Default Electricity Tariff
          (₹/kWh)
        </label>

        <input
          type="number"
          value={
            tariff
          }
          min={0}
          step={0.1}
          onChange={(e) =>
            setTariff(
              Number(
                e.target.value
              )
            )
          }
        />


        <label>
          Distance Unit
        </label>

        <select
          value={
            distanceUnit
          }
          onChange={(e) =>
            setDistanceUnit(
              e.target.value
            )
          }
        >

          <option value="km">
            km
          </option>

          <option value="mi">
            mi
          </option>

        </select>

      </div>


      {/* ======================================================
          FAMILY SHARING
          ====================================================== */}

      <div className="card">

        <h3>
          👨‍👩‍👧 Family Sharing
        </h3>


        {loadingFamily ? (

          <p>
            Loading family
            information...
          </p>

        ) : family ? (

          <>
            <p
              style={{
                marginTop: 8,
                fontWeight: 600,
              }}
            >
              {family.family_name}
            </p>


            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginTop: "6px",
              }}
            >
              Family members can view
              each other's EV Toolkit
              data. Each member can
              modify only records they
              created.
            </p>


            {/* ==================================================
                FAMILY MEMBERS
                ================================================== */}

            <div
              style={{
                marginTop: "20px",
              }}
            >

              <h4>
                Family Members
              </h4>


              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "12px",
                }}
              >

                {familyMembers.map(
                  (member) => {

                    const isCurrentUser =
                      member.user_id ===
                      currentUserId;

                    const isOwner =
                      member.role ===
                      "owner";


                    const displayName =
                      member.email;


                    return (
                      <div
                        key={
                          member.member_id
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "12px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          flexWrap: "wrap",
                        }}
                      >

                        <div>

                          <div
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {displayName}

                            {isCurrentUser && (
                              <span
                                style={{
                                  marginLeft: "8px",
                                  fontSize: "12px",
                                  color: "#6b7280",
                                }}
                              >
                                You
                              </span>
                            )}
                          </div>


                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginTop: "4px",
                            }}
                          >
                            {isOwner
                              ? "Owner"
                              : "Member"}
                          </div>

                        </div>


                        {isFamilyOwner &&
                          !isOwner && (

                            <button
                              className="deleteButton"
                              disabled={
                                removingMemberId ===
                                member.member_id
                              }
                              onClick={() =>
                                void handleRemoveMember(
                                  member
                                )
                              }
                            >
                              {removingMemberId ===
                              member.member_id
                                ? "Removing..."
                                : "Remove"}
                            </button>

                          )}

                      </div>
                    );
                  }
                )}

              </div>

            </div>


            {/* ==================================================
                INVITE MEMBER
                ================================================== */}

            {isFamilyOwner && (

              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >

                <h4>
                  Invite Family Member
                </h4>


                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "6px",
                  }}
                >
                  Search registered users
                  by first name, last name,
                  or email address.
                </p>


                {/* ==================================================
                    SEARCH
                    ================================================== */}

                <div
                  style={{
                    position: "relative",
                    marginTop: "14px",
                    maxWidth: "520px",
                  }}
                >

                  <input
                    type="text"
                    value={
                      searchText
                    }
                    placeholder="Search by first name, last name, or email..."
                    disabled={
                      sendingInvitation
                    }
                    onChange={(e) => {

                      setSearchText(
                        e.target.value
                      );

                      setSelectedUser(
                        null
                      );
                    }}
                    style={{
                      width: "100%",
                    }}
                  />


                  {/* ==================================================
                      SEARCH RESULTS
                      ================================================== */}

                  {searchText.trim() !== "" &&
                    !selectedUser && (

                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        marginTop: "4px",
                        maxHeight: "280px",
                        overflowY: "auto",
                        boxShadow:
                          "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >

                      {availableUsers.length >
                      0 ? (

                        availableUsers.map(
                          (user) => {

                            const fullName =
                              `${user.first_name ?? ""} ${user.last_name ?? ""}`
                                .trim();


                            return (
                              <button
                                key={
                                  user.user_id
                                }
                                type="button"
                                onClick={() => {

                                  setSelectedUser(
                                    user
                                  );

                                  setSearchText(
                                    fullName ||
                                      user.email
                                  );
                                }}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  border: "none",
                                  background: "transparent",
                                  padding: "12px 14px",
                                  cursor: "pointer",
                                }}
                              >

                                <div
                                  style={{
                                    fontWeight: 600,
                                  }}
                                >
                                  {fullName ||
                                    user.email}
                                </div>


                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "#6b7280",
                                    marginTop: "3px",
                                  }}
                                >
                                  {
                                    user.email
                                  }
                                </div>

                              </button>
                            );
                          }
                        )

                      ) : (

                        <div
                          style={{
                            padding: "12px 14px",
                            fontSize: "13px",
                            color: "#6b7280",
                          }}
                        >
                          No matching users found.
                        </div>

                      )}

                    </div>

                  )}

                </div>


                {/* ==================================================
                    SELECTED USER
                    ================================================== */}

                {selectedUser && (

                  <div
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: "8px",
                      maxWidth: "520px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {`${selectedUser.first_name ?? ""} ${selectedUser.last_name ?? ""}`
                          .trim() ||
                          selectedUser.email}
                      </div>


                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginTop: "3px",
                        }}
                      >
                        {
                          selectedUser.email
                        }
                      </div>


                      <div
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        Role: <strong>Member</strong>
                      </div>

                    </div>


                    <button
                      type="button"
                      disabled={
                        sendingInvitation
                      }
                      onClick={() => {

                        setSelectedUser(
                          null
                        );

                        setSearchText(
                          ""
                        );
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                      aria-label="Clear selected user"
                    >
                      ×
                    </button>

                  </div>

                )}


                {/* ==================================================
                    INVITE BUTTON
                    ================================================== */}

                <button
                  className="primaryButton"
                  disabled={
                    sendingInvitation ||
                    !selectedUser
                  }
                  onClick={() =>
                    void handleInvite()
                  }
                  style={{
                    marginTop: "12px",
                  }}
                >
                  {sendingInvitation
                    ? "Sending..."
                    : "Invite Member"}
                </button>

              </div>

            )}


            {/* ==================================================
                PENDING INVITATIONS
                ================================================== */}

            {invitations.some(
              (invitation) =>
                invitation.status ===
                "pending"
            ) && (

              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >

                <h4>
                  Pending Invitations
                </h4>


                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >

                  {invitations
                    .filter(
                      (invitation) =>
                        invitation.status ===
                        "pending"
                    )
                    .map(
                      (invitation) => {

                        const invitationIsForCurrentUser =
                          normalizeEmail(
                            invitation.email
                          ) ===
                          normalizeEmail(
                            currentUserEmail
                          );


                        return (
                          <div
                            key={
                              invitation.id
                            }
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              padding: "12px",
                              border:
                                "1px solid #e5e7eb",
                              borderRadius:
                                "8px",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <div>

                              <div
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                {
                                  invitation.email
                                }
                              </div>


                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#6b7280",
                                  marginTop: "4px",
                                }}
                              >
                                {
                                  invitation.family_name
                                }
                                {" • Member"}
                              </div>

                            </div>


                            {invitationIsForCurrentUser ? (

                              <button
                                className="primaryButton"
                                disabled={
                                  acceptingInvitationId ===
                                  invitation.id
                                }
                                onClick={() =>
                                  void handleAcceptInvitation(
                                    invitation.id
                                  )
                                }
                              >
                                {acceptingInvitationId ===
                                invitation.id
                                  ? "Accepting..."
                                  : "Accept"}
                              </button>

                            ) : (

                              <span
                                style={{
                                  fontSize: "12px",
                                  color: "#d97706",
                                }}
                              >
                                Pending
                              </span>

                            )}

                          </div>
                        );
                      }
                    )}

                </div>

              </div>

            )}

          </>

        ) : (

          <div>

            <p
              style={{
                marginTop: "8px",
              }}
            >
              You are not currently a
              member of a family.
            </p>


            {invitations
              .filter(
                (invitation) =>
                  invitation.status ===
                    "pending" &&
                  normalizeEmail(
                    invitation.email
                  ) ===
                    normalizeEmail(
                      currentUserEmail
                    )
              )
              .map(
                (invitation) => (
                  <div
                    key={
                      invitation.id
                    }
                    style={{
                      marginTop: "16px",
                      padding: "14px",
                      border:
                        "1px solid #e5e7eb",
                      borderRadius:
                        "8px",
                    }}
                  >

                    <p>
                      You have been invited
                      to join{" "}
                      <strong>
                        {
                          invitation.family_name
                        }
                      </strong>
                      .
                    </p>


                    <button
                      className="primaryButton"
                      style={{
                        marginTop: "10px",
                      }}
                      disabled={
                        acceptingInvitationId ===
                        invitation.id
                      }
                      onClick={() =>
                        void handleAcceptInvitation(
                          invitation.id
                        )
                      }
                    >
                      {acceptingInvitationId ===
                      invitation.id
                        ? "Accepting..."
                        : "Accept Invitation"}
                    </button>

                  </div>
                )
              )}

          </div>

        )}

      </div>


      {/* ======================================================
          BACKUP & RESTORE
          ====================================================== */}

      <div className="card">

        <h3>
          💾 Backup & Restore
        </h3>

        <p>
          Export all your EV Toolkit
          data into a single backup
          file or restore it later on
          any device.
        </p>


        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          <button
            className="primaryButton"
            onClick={() =>
              void createBackup()
            }
          >
            📥 Create Backup
          </button>


          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            style={{
              display: "none",
            }}
            onChange={async (e) => {

              const file =
                e.target.files?.[0];


              if (!file) {
                return;
              }


              await handleRestore(
                file
              );
            }}
          />


          <button
            className="restoreButton"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            📤 Restore Backup
          </button>

        </div>


        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "12px",
          }}
        >
          Backup includes Charging
          History, Service History,
          Tyre History, Document Vault,
          Insurance and future supported
          modules.
        </p>

      </div>


      {/* ======================================================
          GST INFORMATION
          ====================================================== */}

      <div className="card">

        <h3>
          GST Information
        </h3>


        <p
          style={{
            marginTop: 12,
          }}
        >
          • Home AC Charging : No GST
        </p>


        <p
          style={{
            marginTop: 8,
          }}
        >
          • Public AC Charging : As per
          operator pricing
        </p>


        <p
          style={{
            marginTop: 8,
          }}
        >
          • DC Fast Charging : 18% GST
          applied
        </p>

      </div>
    </>
  );
}


export default Settings;