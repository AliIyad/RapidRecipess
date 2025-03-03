// Firebase Admin Configuration
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = {
  type: "service_account",
  project_id: "rapid-recipes-b162c",
  private_key_id: "dd1c0cbadc8a2421b3bb5a82b685b3a267b085ac",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4iOuojjDvKxB9\nh0UP6V/OEZdNTm9HWk6jVKLAEPyUUPRqc8KPsfaVZLMLnfJgnMVQrrgR5WHJMrNW\nI/qZOpgsGa5TPZaq/AgeTFlOw/Y6vss7S18eGTuwflWJ+ErvPj5x3L42Xs9KOtC/\nr4/R5ajT1r8CNvRZtYoY3UIE00BFglHWAhDxcIW+tWblbVhc4ydfUpRuwouAx5np\nbKvszDmn2DIH1IeyZAJHhSsHMU08eglgmNmSGXmj96Uo079jH1noYAkF3F1Kevbt\nrs7n8OAna9GCLaVFvwkkW43hveyAW5169hRL/C3bCFKBr+Mjb+QaSnmTCjpe/SBA\n+92I4oipAgMBAAECggEAB8Jcw6ye6so7xPDK0EghgCUF4KPwp+Zoh2jyovLT5q9K\nElklutcNJZZOClSs3AUbgttQir1uEYCxQROoNjMxh4EuRE/C+xONNSuZVxIu/foH\nH595XhGfjI9IrNF6N88SicUctmU21XSIUdcMTBNvuDXqYtR0DSWbVepPxqt/TgIs\nnhfYuAQsROZ9jJpzJJsGxMd+So65DOJPOpYuUrQl6vjgT1mcDNCky+jzdK+xrg8A\npgp9Edo6hj9ZOL2VujOw5vt93WPX+s+pDcQ8Y39D7y4xujEj2Hm0duFFFRa/qRpG\n2Ywtxw0BjtM4WbNzqNn6jk0MOTQJQLvHVVdml0/8tQKBgQD+2WFPCpxSuuFiwWso\n4IacpQPpVxTECnF6v94BuL9CUAsjlVECJVPuIzRY4ANmphiE9YJd7pZdDcrKDQt7\n9nUl6bOkRn5EjDaI2YcHivlcuYki1X7WAw3pbz1ltxmtcCY9H5MU+0OPUijoYdGe\n4zxpDyeHK5/Z+EHehjLH3LaJRwKBgQC5XkDPSryjYrNtukn9SLGSdNsoIWankoNy\nOV/CTlQRxvV483c4xtATeJlXZ5Nf99S9ZIKbkICBpeMUwoYbP/D7mq1ORt+AkzIE\neWt88csBY/bZnsKf6uG3Q933hA67gCCSQqROccBlsiQFHn48qrKPbKfmNfgJcBSW\nwKHDc8JWjwKBgExJgimJAZZ6PrGzOIK6A1Gsy+jzmlG81o9qE+jsBsSw9USnk+JS\njjdA7pCULjByE/DpFSdNHlGoqUWmdgObmSHKPW41c+LNHh4FD7igT1kEaRq2Ugt6\nSpXQKM7j6pnScn/ljb/AH08txvUZIwiu+Qxx7uE1m9pByGX2Qgk19qZNAoGBAIOl\nA2P0ENn8C6+ewFMn4CxB3y614eCaNc3WH0KwPBZP9R8L0Ry6XSWm3UfsoAZkzGog\nynzOd+UbOZURvQn3NB6LsA7KWIpIfxocXRDj6yc2piXRESlfNyPfB/FzkL7qdLdK\nqsOnF1th0yDrkf1lwOAI64ibxWZ2ebjCX1+eg2LTAoGBAPSif+R0wKmZNnZ5YIsz\nGZQfXT6plYdHaoLi/Gzv3yoc5D5HjRzw3pAXzFJugkqfrwpgwoUcCsADYJ4Cb3Fb\nephB1l04v9+hl40We/Ovlk/qsHYfGdcbrl7pC3Z38P/jhhtlF8BkxWsFyKlBx1pQ\nNlHvr59/Zh6cEqPX5Zvv6sYM\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fbsvc@rapid-recipes-b162c.iam.gserviceaccount.com",
  client_id: "102631092287524879319",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40rapid-recipes-b162c.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
