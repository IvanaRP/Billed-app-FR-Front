





import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    // test("Then ...", () => {
    //   const html = NewBillUI()
    //   document.body.innerHTML = html
    //   //to-do write assertion

    // })
    test("Then I should upload validated file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html 

      const inputData = {
        files: "../assets/images/avataaars_Girl2.png"
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





// examples

// describe("Given I am connected as an employee", () => {
//   describe("When I fill input with good extension file", () => {
//     test("Then the file should be upload")

// describe("Given I am connected as an employee", () => {
//   describe("When I fill input with wrong extension file", () => {
//     test("Then the file should not be uploaded")