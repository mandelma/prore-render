package com.example.prokeikkatori;

import com.getcapacitor.BridgeActivity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "default_channel_id",
                "Default Channel",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Used for general notifications");

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}



// package com.example.prokeikkatori;
// import com.getcapacitor.BridgeActivity;
// import android.os.Bundle;
// import android.app.NotificationChannel;
// import android.app.NotificationManager;
// import android.os.Build;
//
// public class MainActivity extends BridgeActivity {
//     @Override
//     public void onCreate(Bundle savedInstanceState) {
//         super.onCreate(savedInstanceState);
//
//         if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//             NotificationChannel channel = new NotificationChannel(
//                 "default_channel_id",
//                 "Default Channel",
//                 NotificationManager.IMPORTANCE_DEFAULT
//             );
//             channel.setDescription("Used for general notifications");
//
//             NotificationManager manager = getSystemService(NotificationManager.class);
//             if (manager != null) {
//                 manager.createNotificationChannel(channel);
//             }
//         }
//     }
// }

