// import { screen } from "@testing-library/dom";
// import BillsUI from "../views/BillsUI.js";
// import { bills } from "../fixtures/bills.js";

import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bill, {
  handleClickNewBill,
  handleClickIconEye,
} from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: [] });
      document.body.innerHTML = html;
      //to-do write expect expression

    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      // const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const antiChrono = (a, b) => (b - a ? -1 : 1);

      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});



describe("Given I am connected as an employee", () => {
  describe("When I click on button 'Nouvelle note de frais'", () => {
    test("Then the page new bill appear", () => {
      document.body.innerHTML = BillsUI(bills);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const bill = new Bill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      });

      const btnNewBill = screen.getByTestId("btn-new-bill");
      const mockFunction = jest.fn(bill.handleClickNewBill);

      btnNewBill.addEventListener("click", mockFunction);
      fireEvent.click(btnNewBill);

      expect(mockFunction).toHaveBeenCalled();
    });
  });
});

// describe('Given I am connected as employee and I am on Bills page', () => {
//   describe('When I click on the icon eye', () => {
//     test('then bill image should open', () => {
//       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//       window.localStorage.setItem('user', JSON.stringify({
//         type: 'Employee'
//       }))
//       const html = BillsUI({data:bills})
//       document.body.innerHTML = html
//       const onNavigate = (pathname) => {
//         document.body.innerHTML = ROUTES({ pathname })
//       }
//       const store = null
//       const bill = new Bill({
//         document, onNavigate, store, bills, localStorage: window.localStorage
//       })

//       const firestore = null

      
//       $.fn.modal = jest.fn();

//       let handleClickIconEye;
//       const iconEye = screen.getAllByTestId(`icon-eye`);
//       iconEye.forEach(eye => {
//         handleClickIconEye = jest.fn(bill.handleClickIconEye(eye));
//         eye.addEventListener("click", handleClickIconEye)
//         fireEvent.click(eye)
//       });


//       expect(handleClickIconEye).toHaveBeenCalled();
//       const modale = screen.getByTestId('modaleFile');
//       expect(modale).toBeTruthy();

//       // // const handleClickIconEye = jest.fn(bill.handleClickIconEye)
//       // let handleClickIconEye;
//       // const eye = screen.getAllByTestId('icon-eye')
//       // eye.addEventListener('click', handleClickIconEye)
//       // userEvent.click(eye)
//       // expect(handleClickIconEye).toHaveBeenCalled()

//       // const modale = screen.getByTestId('modaleFile')
//       // expect(modale).toBeTruthy()
//     })
//   })
// })


// test d'intégration GET  = like form dashboard.js
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills Page", () => {
    test("Then it fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(store, "get")
       const bills = await store.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

