import * as Printer from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import {  ref, uploadBytes,getDownloadURL} from "firebase/storage";
import { storage } from '../../config';




export const buildInvoice = async (order: any) => {
    const { shipping_details, items, total_price, date_created, id } = order
    const { address, email, name } = shipping_details
    const { addressName, buildingName, contactNumber, houseFlatNo, placeName } = address

    const html = `
    <html>
    <head>
    <style>
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
        min-height: 90vh;
    }

    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    .invoice-box table td {
        padding: 5px;
        vertical-align: top;
    }

    .invoice-box table tr td:nth-child(2) {
        text-align: right;
    }

    .invoice-box table tr.top table td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }

    .invoice-box table tr.information td table tr td {
        padding-bottom: 40px;
    }

    .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
        padding: 10px;
        font-size: 16px;
        text-align: center;
    }

    .invoice-box table tr.details td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.item td{
        border-bottom: 1px solid #eee;
        text-align: center;
    }

    .invoice-box table tr.item.last td {
        border-bottom: none;
    }

    .invoice-box table tr.total td:nth-child(2) {
        text-align: center;
        font-weight: bold;
    }

    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }

        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }

    .center {
        text-align: center;
    }

    .info {
        text-align: left;
        max-width: 50%;
        text-wrap: balanced;
    }

    </style>
    </head>

    <body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="4">
                    <table>
                        <tr>
                            <td class="title">
                            <svg xmlns="http://www.w3.org/2000/svg" style="max-width:300px;max-height:100px;position:relative;left:-90px;top:-10px" version="1.0" width="1029.000000pt" height="476.000000pt" viewBox="0 0 1029.000000 476.000000" preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,476.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                            <path d="M2309 3313 c-46 -7 -132 -66 -171 -118 -57 -76 -79 -150 -85 -286 -3 -64 0 -156 6 -205 56 -422 300 -866 578 -1051 115 -76 202 -105 323 -105 110 -1 185 21 290 82 187 109 375 358 490 651 169 429 169 810 1 962 -61 55 -103 70 -201 71 -110 1 -163 -23 -226 -103 -87 -111 -142 -258 -234 -621 -57 -225 -108 -392 -120 -385 -8 5 -60 200 -126 470 -73 305 -131 441 -232 547 -80 84 -166 111 -293 91z"/>
                            <path d="M4195 3301 c-112 -52 -163 -181 -185 -474 -19 -250 -8 -777 21 -955 24 -153 79 -259 154 -297 52 -26 165 -27 212 -2 130 70 183 271 199 752 7 236 -9 601 -32 711 -30 150 -97 250 -181 273 -59 17 -143 13 -188 -8z"/>
                            <path d="M5204 2731 c-361 -58 -593 -406 -504 -755 28 -112 71 -185 154 -264 118 -112 240 -159 436 -169 207 -10 358 32 414 117 37 56 36 110 -4 143 -43 36 -75 40 -194 22 -83 -12 -120 -13 -172 -5 -80 13 -108 27 -154 75 l-35 37 40 -7 c134 -27 304 -20 413 16 172 57 253 161 254 329 0 200 -147 381 -362 444 -65 20 -214 28 -286 17z m182 -370 c39 -23 61 -73 48 -108 -22 -63 -124 -91 -210 -58 -58 22 -79 52 -64 91 13 35 47 73 75 84 37 16 118 11 151 -9z"/>
                            <path d="M6454 2730 c-314 -46 -541 -326 -520 -640 11 -164 60 -274 170 -378 118 -112 240 -159 436 -169 266 -13 440 63 440 193 0 35 -5 47 -30 67 -43 37 -74 40 -198 22 -165 -24 -250 -6 -322 70 l-35 37 40 -7 c202 -39 405 -11 531 72 91 60 135 148 136 273 0 87 -19 151 -68 227 -116 181 -335 269 -580 233z m182 -369 c62 -38 68 -112 12 -154 -79 -59 -268 -5 -242 69 12 32 55 85 78 94 39 16 119 11 152 -9z"/>
                            <path d="M7540 2709 c-153 -39 -264 -116 -320 -220 -29 -54 -35 -74 -34 -129 0 -152 91 -249 322 -340 46 -18 89 -42 97 -54 31 -43 9 -86 -43 -86 -11 0 -44 17 -73 37 -152 105 -348 1 -300 -159 16 -51 73 -113 131 -143 150 -76 408 -91 615 -35 144 38 251 125 281 226 20 70 15 154 -14 210 -30 60 -95 112 -191 156 -157 71 -156 70 -156 103 0 21 7 33 27 44 25 14 31 14 80 -9 71 -32 170 -38 218 -13 75 39 101 131 61 218 -39 87 -169 171 -310 201 -99 21 -299 17 -391 -7z"/>
                            <path d="M5973 1402 c-52 -8 -72 -105 -32 -156 39 -49 119 -29 124 32 3 33 -14 47 -46 37 -23 -8 -25 -25 -4 -25 8 0 15 -9 15 -20 0 -16 -7 -20 -30 -20 -47 0 -67 61 -34 108 17 25 52 29 60 7 8 -19 34 -20 34 -1 0 26 -43 45 -87 38z"/>
                            <path d="M5400 1310 c0 -73 3 -90 15 -90 11 0 15 11 15 40 l0 40 40 0 40 0 0 -40 c0 -29 4 -40 15 -40 12 0 15 17 15 90 0 73 -3 90 -15 90 -10 0 -15 -11 -15 -35 0 -34 -1 -35 -40 -35 -39 0 -40 1 -40 35 0 24 -5 35 -15 35 -12 0 -15 -17 -15 -90z"/>
                            <path d="M5690 1340 c16 -33 30 -73 30 -90 0 -20 5 -30 15 -30 10 0 15 10 15 33 0 17 14 58 30 90 28 52 29 57 12 57 -13 0 -25 -14 -38 -41 l-18 -41 -20 41 c-13 26 -27 41 -38 41 -16 0 -15 -6 12 -60z"/>
                            <path d="M6200 1310 c0 -73 3 -90 15 -90 12 0 15 17 15 90 0 73 -3 90 -15 90 -12 0 -15 -17 -15 -90z"/>
                            <path d="M6360 1310 l0 -90 60 0 c47 0 60 3 60 15 0 11 -11 15 -40 15 -36 0 -40 3 -40 25 0 22 4 25 35 25 24 0 35 5 35 15 0 10 -11 15 -35 15 -31 0 -35 3 -35 25 0 23 4 25 40 25 22 0 40 5 40 10 0 6 -27 10 -60 10 l-60 0 0 -90z"/>
                            <path d="M6600 1311 c0 -84 2 -91 20 -91 16 0 19 8 22 61 l3 61 35 -61 c22 -38 42 -61 53 -61 15 0 17 11 17 90 0 73 -3 90 -15 90 -12 0 -15 -13 -15 -55 0 -30 -4 -55 -8 -55 -4 0 -21 24 -38 53 -20 34 -37 53 -52 55 -21 3 -22 1 -22 -87z"/>
                            <path d="M6880 1310 l0 -90 60 0 c47 0 60 3 60 15 0 11 -12 15 -45 15 -41 0 -45 2 -45 25 0 23 4 25 40 25 29 0 40 4 40 15 0 11 -11 15 -41 15 -36 0 -40 2 -37 23 2 18 10 23 46 25 64 5 50 22 -18 22 l-60 0 0 -90z"/>
                            <path d="M7280 1310 c0 -73 3 -90 15 -90 12 0 15 15 16 68 l1 67 25 -67 c14 -38 31 -68 37 -68 6 0 22 30 36 68 l25 67 3 -67 c2 -52 6 -68 17 -68 12 0 15 18 15 90 0 88 -1 90 -24 90 -20 0 -27 -10 -48 -67 l-24 -67 -24 67 c-20 57 -27 67 -47 67 -22 0 -23 -3 -23 -90z"/>
                            <path d="M7600 1310 l0 -90 60 0 c47 0 60 3 60 15 0 11 -12 15 -45 15 -41 0 -45 2 -45 25 0 23 4 25 40 25 29 0 40 4 40 15 0 11 -11 15 -41 15 -36 0 -40 2 -37 23 2 18 10 23 46 25 64 5 50 22 -18 22 l-60 0 0 -90z"/>
                            <path d="M7874 1353 c-9 -27 -23 -63 -31 -82 -17 -43 -16 -51 3 -51 9 0 18 9 21 20 4 16 14 20 43 20 29 0 39 -4 43 -20 3 -11 13 -20 22 -20 9 0 15 6 13 13 -55 154 -62 167 -79 167 -12 0 -23 -15 -35 -47z m50 -25 c9 -35 8 -38 -14 -38 -11 0 -20 3 -20 8 0 19 13 52 20 52 4 0 10 -10 14 -22z"/>
                            <path d="M8080 1391 c0 -5 12 -11 28 -13 27 -3 27 -4 30 -80 2 -60 6 -78 17 -78 12 0 15 17 15 80 l0 80 30 0 c17 0 30 5 30 10 0 6 -32 10 -75 10 -41 0 -75 -4 -75 -9z"/>
                            </g>
                            </svg>
                            </td>

                            <td>
                                Invoice #: ${id}<br>
                                Created: ${date_created.toDate().toDateString()} ${date_created.toDate().toLocaleTimeString('en-US')}<br>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="information">
                <td colspan="4">
                    <table>
                        <tr>
                            <td>
                                <h3> Customer Details</h3>
                                <div class="info">Name - ${name} </div>
                                <div class="info">Email -  ${email} </div>
                                <div class="info">Phone No -  ${contactNumber} </div>
                                <h3> Shipping Details:  </h3>
                                <div class="info"> ${houseFlatNo} </div>
                                <div class="info"> ${buildingName} </div>
                                <div class="info"> ${placeName} </div> 
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <tr class="heading">
                <td>
                    Item
                </td>

                <td>
                    Quantity
                </td>

                <td>
                    Price
                </td>

                <td>
                    Total
                </td>
            </tr>

            ${items.map((item: any) => (
                `<tr class="item">
                <td>
                    ${item.product.name} - ${item.selectedVariant.name}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${item.selectedVariant.discountedPrice}
                </td>

                <td>
                    ${item.selectedVariant.discountedPrice * item.quantity}
                </td>
            </tr>`
            ))}

            <tr class="total">
                <td></td>
                <td></td>
                <td></td>
                <td>
                     Total: ${total_price}
                </td>
            </tr>
        </table>
    </div>
    </body>
    </html>
    `
    
    const x = await Printer.printToFileAsync({ html })
    const fileUri = x.uri
    

    const response = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

     
      
    const blob:Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', fileUri, true);
        xhr.send(null);
      });

      console.log(blob)

    const storageRef = ref(storage, `Invoice/${id}.pdf`);
    console.log(blob)
    await uploadBytes(storageRef, blob)
    const val = await getDownloadURL(storageRef)
    return val

}

export const downloadInvoice = async (uri:string) => {
    try {
        const localUri = FileSystem.documentDirectory + 'invoice.pdf';
        const options: FileSystem.DownloadOptions = {
          headers: {},
          md5: false,
          cache: true,
        };
    
        await FileSystem.downloadAsync(uri, localUri, options);
        const fileUri = localUri;
        const cUri = await FileSystem.getContentUriAsync(fileUri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: cUri,
          type: 'application/pdf',
          flags: 1,
        });
      } catch (error) {
        console.error('Error downloading and opening file:', error);
      }
}