// import { screen } from "@testing-library/dom";
// import BillsUI from "../views/BillsUI.js";
// import { bills } from "../fixtures/bills.js";

import { fireEvent, screen } from "@testing-library/dom";
// import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bill from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import Router from "../app/Router";

import { bills } from "../fixtures/bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";
import Bills from "../containers/Bills.js";

// 74% ok

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    //to-do write expect expression
    test("Then bill icon in vertical layout should be highlighted", () => {
      store.bills = () => ({ bills, get: jest.fn().mockResolvedValue() });
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      // Build DOM with Bills
      const pathname = ROUTES_PATH["Bills"];
      Object.defineProperty(window, "location", { value: { hash: pathname } });
      document.body.innerHTML = `<div id="root"></div>`;
      // Router to have active class
      Router();

      const icoWin = screen.getByTestId("icon-window");
      const iconActived = icoWin.classList.contains("active-icon");
      expect(iconActived).toBeTruthy();
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

  describe("When there are bills on the Bills page", () => {
    test("Then it should display an icon eye", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const iconEye = screen.getAllByTestId("icon-eye");
      expect(iconEye).toBeTruthy();
    });
  });

  describe("When I am on Bills page but it is loading", () => {
    test("Then Loading page should be rendered", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
  describe("When I am on Bills page but back-end send an error message", () => {
    test("Then Error page should be rendered", () => {
      const html = BillsUI({ error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
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





describe("Given I am connected as an employee", () => {
  describe("When I click on icon eye", () => {
    test("Then it should have open modal", () => {
      // Build DOM with data of bills
      const html = BillsUI({ data: [...bills] });
      document.body.innerHTML = html;
  
      // Mock function handleClickIconEye()
      const store = null;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const mockBills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
  
      $.fn.modal = jest.fn();
  
      const eyes = screen.getAllByTestId("icon-eye");
      expect(eyes).toBeTruthy();
  
      const mockHandleClickIconEye = jest.fn(
        mockBills.handleClickIconEye(eyes[0])
      );
  
      eyes[0].addEventListener("click", mockHandleClickIconEye);
      fireEvent.click(eyes[0]);
  
      expect(mockHandleClickIconEye).toHaveBeenCalled();
  
      const modal = screen.getByTestId("modal-show");
      expect(modal).toBeTruthy();
      expect(screen.getByText("Justificatif")).toBeTruthy();
  
      const urlJustificative = bills[0].fileUrl;
      expect(urlJustificative).toBeTruthy();
    });
  });
});

describe("Given an employee enter his email and his password", () => {
  describe("When the inputs are wrong", () => {
    test("Then error page appear", () => {
      const html = BillsUI({ error: "some error message" });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Erreur")).toBeTruthy();
      expect(screen.getAllByText("some error message")).toBeTruthy();
    });
  });
  describe("When the inputs are good", () => {
    test("Then loading page appear", () => {
      const html = BillsUI({ loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    });
  });
});

// test d'intégration GET  = like from dashboard.js
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills Page", () => {
    test("Then it fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(store, "get");
      const bills = await store.get();
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});
