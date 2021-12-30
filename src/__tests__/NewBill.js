// import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { fireEvent, screen } from "@testing-library/dom"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should upload validate file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

      const inputData = {
        files: "../assets/images/facturefreemobile.jpg"
      }

      const form = screen.getByTestId("form-new-bill")
      const inputFile = screen.getByTestId("file")
      fireEvent.change(inputFile, { target: { value: inputData.file } })

      const validExtensions = ["jpg","jpeg","png"]
      const regExpExtension = /(?:\.([^.]+))?$/
      const inputFileExtension = regExpExtension.exec(inputData.files)[1]

      const handleChangeFile = jest.fn(e => e.preventDefault())
      form.addEventListener("submit", handleChangeFile)
      fireEvent.submit(form) 
      expect(validExtensions).toContain(inputFileExtension)
    })
  })
})