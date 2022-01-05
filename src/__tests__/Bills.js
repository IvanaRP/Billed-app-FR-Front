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





describe("When I click on the icon eye", () => {
  test("A modal should open", () => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    const html = BillsUI({ data: bills });

    document.body.innerHTML = html;
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    const firestore = null;
    const bill = new Bill({
      document,
      onNavigate,
      firestore,
      localStorage: window.localStorage,
    });

    const handleClickIconEye = jest.fn(bill.handleClickIconEye);
    const eyes = screen.getAllByTestId("icon-eye");
    eyes.forEach((eye) => {
      eye.addEventListener("click", () => {
        bill.handleClickIconEye;
      });
      userEvent.click(eye);
      expect(bill.handleClickIconEye).toHaveBeenCalled();
    });

    const modale = screen.getByTestId("modaleFile");
    expect(modale).toBeTruthy();
  });
});


describe("Given I am connected as an employee", () => {
  describe("When I click on button 'Nouvelle note de frais'", () => {
    test("Then the page new bill appear", () => {
      document.body.innerHTML = BillsUI(bills);

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      const bill = new Bill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })

      const btnNewBill = screen.getByTestId('btn-new-bill');
      const mockFunction = jest.fn(bill.handleClickNewBill)

      btnNewBill.addEventListener('click', mockFunction)
      fireEvent.click(btnNewBill)

      expect(mockFunction).toHaveBeenCalled()
    })
  })
}) 


