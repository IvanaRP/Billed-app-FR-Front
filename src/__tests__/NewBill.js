import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { bills } from "../fixtures/bills.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store";
import BillsUI from "../views/BillsUI.js";

// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then ...", () => {
//       const html = NewBillUI();
//       document.body.innerHTML = html;
//       //to-do write assertion
//     });
//   });
// });

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should upload a validate file", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
    });
  });

  describe("When I am on NewBill Page and add new file", () => {
    test("Then when I add an image with extension jpg, png or jpeg", () => {
      // Build DOM for new bill page
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Mock function handleChangeFile()
      const store = null;
      const onNavigate = (pathname) => {
        document.body.innerHTML = pathname;
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const mockHandleChangeFile = jest.fn(newBill.handleChangeFile);

      const inputJustificative = screen.getByTestId("file");
      expect(inputJustificative).toBeTruthy();

      // Simulate if the file is an jpg extension
      inputJustificative.addEventListener("change", mockHandleChangeFile);
      fireEvent.change(inputJustificative, {
        target: {
          files: [new File(["file.jpg"], "file.jpg", { type: "file/jpg" })],
        },
      });

      expect(mockHandleChangeFile).toHaveBeenCalled();
      expect(inputJustificative.files[0].name).toBe("file.jpg");

      jest.spyOn(window, "alert").mockImplementation(() => {});
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  describe("When I am on NewBill Page and add new file", () => {
    test("Then when I add an file with other extension than jpg, png or jpeg", () => {
      // Build DOM for new bill page
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Mock function handleChangeFile()
      const store = null;
      const onNavigate = (pathname) => {
        document.body.innerHTML = pathname;
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const mockHandleChangeFile = jest.fn(newBill.handleChangeFile);

      const inputJustificative = screen.getByTestId("file");
      expect(inputJustificative).toBeTruthy();

      // Simulate if the file is wrong format and is not an jpg, png or jpeg extension
      inputJustificative.addEventListener("change", mockHandleChangeFile);
      fireEvent.change(inputJustificative, {
        target: {
          files: [new File(["file.pdf"], "file.pdf", { type: "file/pdf" })],
        },
      });
      expect(mockHandleChangeFile).toHaveBeenCalled();
      expect(inputJustificative.files[0].name).not.toBe("file.jpg");

      jest.spyOn(window, "alert").mockImplementation(() => {});
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe("Given form new bill is open, when click on submit button", () => {
    test("Then should called handleClickNewBill function", () => {
      // Build DOM employee
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      const user = JSON.stringify({
        type: "Employee",
      });
      window.localStorage.setItem("user", user);

      // Build DOM new bill
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Mock function handleSubmit()
      const store = null;
      const onNavigate = (pathname) => {
        document.body.innerHTML = pathname;
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        bills,
        localStorage: window.localStorage,
      });

      const submitFormNewBill = screen.getByTestId("form-new-bill");
      expect(submitFormNewBill).toBeTruthy();

      const mockHandleSubmit = jest.fn(newBill.handleSubmit);
      submitFormNewBill.addEventListener("submit", mockHandleSubmit);
      fireEvent.submit(submitFormNewBill);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });
});

// test d'intégration POST  = like from dashboard.js
describe("Given I am an user connected as employee", () => {
  describe("When I navigate to Dashboard employee", () => {
    test("Add bills from mock API POST", async () => {
      const getSpy = jest.spyOn(store, "post");
      const newBill = {
        id: "47qAXb6fIm2zOKkLzMro",
        vat: "80",
        fileUrl:
          "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        status: "pending",
        type: "Hôtel et logement",
        commentary: "séminaire billed",
        name: "encore",
        fileName: "preview-facture-free-201801-pdf-1.jpg",
        date: "2004-04-04",
        amount: 400,
        commentAdmin: "ok",
        email: "a@a",
        pct: 20,
      };
      const bills = await store.post(newBill);
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(5);
    });

    test("Add bills from an API and fails with 404 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("Add bill from an API and fails with 500 message error", async () => {
      store.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});


