import { ROUTES_PATH } from "../constants/routes.js";
import Logout from "./Logout.js";

export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const formNewBill = this.document.querySelector(
      `form[data-testid="form-new-bill"]`
    );
    formNewBill.addEventListener("submit", this.handleSubmit);
    const file = this.document.querySelector(`input[data-testid="file"]`);
    file.addEventListener("change", this.handleChangeFile);
    this.fileUrl = null;
    this.fileName = null;
    this.billId = null;
    new Logout({ document, localStorage, onNavigate });
  }
  handleChangeFile = (e) => {
    e.preventDefault();
    const file = this.document.querySelector(`input[data-testid="file"]`)
      .files[0];
    const filePath = e.target.value.split(/\\/g);
    const fileName = filePath[filePath.length - 1];
    const formData = new FormData();
    const fileFormatAuthorized = ["jpg", "png", "jpeg"];
    const fileExtension = fileName.split(".").pop().toLowerCase();
    formData.append("file", file);
    console.log(fileExtension);
    if (fileFormatAuthorized.includes(fileExtension)) {
      this.handleStore(formData, fileName);
    } else {
      alert("Le format du fichier doit être en jpg, png ou jpeg");
    }
  };

  /* istanbul ignore next */
  handleStore(formData, fileName) {
    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true,
        },
      })
      .then(({ fileUrl, key }) => {
        console.log(fileUrl);
        this.billId = key;
        this.fileUrl = fileUrl;
        this.fileName = fileName;
      })
      .catch((error) => console.error(error));
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      'e.target.querySelector(`input[data-testid="datepicker"]`).value',
      e.target.querySelector(`input[data-testid="datepicker"]`).value
    );
    
    const bill = {
     
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name: e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(
        e.target.querySelector(`input[data-testid="amount"]`).value
      ),
      date: e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct:
        parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) ||
        20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`)
        .value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: "pending",
    };
    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH["Bills"]);
  };

  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: this.billId })
        .then(() => {
          this.onNavigate(ROUTES_PATH["Bills"]);
        })
        .catch((error) => console.error(error));
    }
  };
}


// // works = cant upload pdf etc
// import { ROUTES_PATH } from '../constants/routes.js'
// import Logout from "./Logout.js"

// export default class NewBill {
//   constructor({ document, onNavigate, firestore, localStorage }) {
//     this.document = document
//     this.onNavigate = onNavigate
//     this.firestore = firestore
//     const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
//     formNewBill.addEventListener("submit", this.handleSubmit)
//     const file = this.document.querySelector(`input[data-testid="file"]`)
//     file.addEventListener("change", this.handleChangeFile)
//     this.fileUrl = null
//     this.fileName = null
//     new Logout({ document, localStorage, onNavigate })
//   }
//   handleChangeFile = e => {
//     const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
//     const filePath = e.target.value.split(/\\/g)
//     const fileName = filePath[filePath.length-1]
//     const fileExtension = fileName.split('.').pop();
//     if(['PNG', 'JPG', 'JPEG'].includes(fileExtension.toUpperCase())) { 
//       this.firestore
//         .storage
//         .ref(`justificatifs/${fileName}`)
//         .put(file)
//         .then(snapshot => snapshot.ref.getDownloadURL())
//         .then(url => {
//           this.fileUrl = url
//           this.fileName = fileName
//         })
//     } else {
//         document.querySelector(`input[data-testid="file"]`).value = "";
//         alert('Désolé, ' + file.name + ' est invalide, extensions autorisées jpeg/jpg/png')
//       }
//   }
//   handleSubmit = e => {
//     e.preventDefault()
//     console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
//     const email = JSON.parse(localStorage.getItem("user")).email
//     const bill = {
//       email,
//       type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
//       name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
//       amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
//       date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
//       vat: e.target.querySelector(`input[data-testid="vat"]`).value,
//       pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
//       commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
//       fileUrl: this.fileUrl,
//       fileName: this.fileName,
//       status: 'pending'
//     }
//     this.createBill(bill)
//     this.onNavigate(ROUTES_PATH['Bills'])
//   }
//   // not need to cover this function by tests
//   createBill = (bill) => {
//     if (this.firestore) {
//       this.firestore
//       .bills()
//       .add(bill)
//       .then(() => {
//         this.onNavigate(ROUTES_PATH['Bills'])
//       })
//       .catch(error => error)
//     }
//   }
// }



// Original code
// import { ROUTES_PATH } from '../constants/routes.js'
// import Logout from "./Logout.js"

// export default class NewBill {
//   constructor({ document, onNavigate, store, localStorage }) {
//     this.document = document
//     this.onNavigate = onNavigate
//     this.store = store
//     const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
//     formNewBill.addEventListener("submit", this.handleSubmit)
//     const file = this.document.querySelector(`input[data-testid="file"]`)
//     file.addEventListener("change", this.handleChangeFile)
//     this.fileUrl = null
//     this.fileName = null
//     this.billId = null
//     new Logout({ document, localStorage, onNavigate })
//   }
//   handleChangeFile = e => {
//     e.preventDefault()
//     const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
//     const filePath = e.target.value.split(/\\/g)
//     const fileName = filePath[filePath.length-1]
//     const formData = new FormData()
//     const email = JSON.parse(localStorage.getItem("user")).email
//     formData.append('file', file)
//     formData.append('email', email)

//     this.store
//       .bills()
//       .create({
//         data: formData,
//         headers: {
//           noContentType: true
//         }
//       })
//       .then(({fileUrl, key}) => {
//         console.log(fileUrl)
//         this.billId = key
//         this.fileUrl = fileUrl
//         this.fileName = fileName
//       }).catch(error => console.error(error))
//   }
//   handleSubmit = e => {
//     e.preventDefault()
//     console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
//     const email = JSON.parse(localStorage.getItem("user")).email
//     const bill = {
//       email,
//       type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
//       name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
//       amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
//       date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
//       vat: e.target.querySelector(`input[data-testid="vat"]`).value,
//       pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
//       commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
//       fileUrl: this.fileUrl,
//       fileName: this.fileName,
//       status: 'pending'
//     }
//     this.updateBill(bill)
//     this.onNavigate(ROUTES_PATH['Bills'])
//   }

//   // not need to cover this function by tests
//   updateBill = (bill) => {
//     if (this.store) {
//       this.store
//       .bills()
//       .update({data: JSON.stringify(bill), selector: this.billId})
//       .then(() => {
//         this.onNavigate(ROUTES_PATH['Bills'])
//       })
//       .catch(error => console.error(error))
//     }
//   }
// }

