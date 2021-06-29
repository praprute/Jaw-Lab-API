
module.exports = {
    secret: '4r0j959709ni62078u478o',
    dbOption: {
       host: '127.0.0.1',
        user: 'root',
        password: '12345678',
        port: 3306,
        database: 'jaw-app',
        dateStrings: true,
        insecureAuth : true
        // host: '128.199.228.63',
        // user: 'admin',
        // password: '0990576878JUNIOR',
        // port: 3306,
        // database: 'jaw-app',
        // dateStrings: true,
        // insecureAuth : true
    }
}

// location /api {
//     proxy_pass http://localhost:3022;
//     proxy_http_version 1.1;
//     proxy_set_header Upgrade $http_upgrade;
//     proxy_set_header Connection 'upgrade';
//     proxy_set_header Host $host;
//     proxy_cache_bypass $http_upgrade;
// }

// location / {
//     proxy_pass http://localhost:3000;
//     proxy_http_version 1.1;
//     proxy_set_header Upgrade $http_upgrade;
//     proxy_set_header Connection 'upgrade';
//     proxy_set_header Host $host;
//     proxy_cache_bypass $http_upgrade;
// }
