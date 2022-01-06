import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should upload validate file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion

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