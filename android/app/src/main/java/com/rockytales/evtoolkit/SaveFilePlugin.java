
package com.rockytales.evtoolkit;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.InputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "SaveFile")
public class SaveFilePlugin extends Plugin {

    @PluginMethod
    public void saveFile(PluginCall call) {
        String fileName = call.getString("fileName");
        String mimeType = call.getString("mimeType");
        String sourceUri = call.getString("sourceUri");

        if (fileName == null || fileName.trim().isEmpty()
                || sourceUri == null || sourceUri.trim().isEmpty()) {
            call.reject("A filename and source file are required.");
            return;
        }

        if (mimeType == null || mimeType.trim().isEmpty()) {
            mimeType = "application/octet-stream";
        }

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType(mimeType);
        intent.putExtra(Intent.EXTRA_TITLE, fileName);

        // Save only the small source URI in the plugin call state.
        call.save();
        startActivityForResult(call, intent, "saveDocumentResult");
    }

    @ActivityCallback
    private void saveDocumentResult(PluginCall call, ActivityResult result) {
        if (call == null) {
            return;
        }

        if (result.getResultCode() != Activity.RESULT_OK
                || result.getData() == null
                || result.getData().getData() == null) {
            call.resolve(new JSObject().put("cancelled", true));
            return;
        }

        String sourceUriString = call.getString("sourceUri");
        Uri destinationUri = result.getData().getData();

        if (sourceUriString == null || sourceUriString.trim().isEmpty()) {
            call.reject("The temporary source file is missing.");
            return;
        }

        Uri sourceUri = Uri.parse(sourceUriString);

        try (InputStream input = getContext()
                    .getContentResolver()
                    .openInputStream(sourceUri);
             OutputStream output = getContext()
                    .getContentResolver()
                    .openOutputStream(destinationUri, "wt")) {

            if (input == null) {
                call.reject("Android could not read the temporary file.");
                return;
            }

            if (output == null) {
                call.reject("Android could not open the selected destination.");
                return;
            }

            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = input.read(buffer)) != -1) {
                output.write(buffer, 0, bytesRead);
            }

            output.flush();

            JSObject response = new JSObject();
            response.put("cancelled", false);
            response.put("uri", destinationUri.toString());
            call.resolve(response);

        } catch (Exception exception) {
            call.reject("Unable to save the selected file.", exception);
        }
    }
}
