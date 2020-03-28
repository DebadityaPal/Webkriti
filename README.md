
# Five Hundred Miles

## PROJECT DESCRIPTION

A simple CRUD application in the form of a travel blog, written in Node.js, HTML, JavaScript and MySQL.
## Registerd Accounts:
* Username: p.debaditya@yahoo.com
   Password: webkriti
* Username: something@abc.com
   Password: secure
* Username: test@test.com
   Password: testing

## FEATURES

* **Authentication:** All the endpoints of the blog (except the login and register endpoints) are protected well using express sessions authentication. Passwords are not directly stored in the database, only the encrypted password Hashes are stored. Thus it is not possible to extract the password via SQLi.
* **URL modification protection:** Each endpoint has  ways to check if the user is eligible to access that endpoint to prevent access  by changing parameters in the URL.
* **File Upload System:** We have used multer as a file upload middleware using multipart form data from the html forms in the frontend. The middleware has checks to filter the file and not upload it if it is not an image. If the corresponding POST request fails, a check is added to stop the file upload.
* **Cached HTML form data:** Certain fields of the HTML are cached and if the form submission fails or if there is an error, the data is not totally removed as is the default case with HTML forms. The stored fields are put in the form fields so that the user does not have to type everything from scratch again. Passwords aren't cached for obvious reasons.
* **Back to Top button:** The homepage includes a back to top button which is visible when the user scrolls down and when clicked takes him back to the top of the page. Simple JavaScript code.
* **User Specific Edit/Delete privileges:** Only the author of the posts get the additional buttons to edit or delete the post, others can only view the read more button.
Make sure you give detailed description of the features

## SCREENSHOTS

https://drive.google.com/drive/folders/1r_M60FUVqw_EdTY_MgK9ld5PDH3ZRO5a?usp=sharing

## VIDEO

https://drive.google.com/drive/folders/1eRi4AcKrjirRMKGuTxK2ZYKUhm6fphEs?usp=sharing

## HOSTED WEBSITE LINK

[https://powerful-shelf-48323.herokuapp.com/](https://powerful-shelf-48323.herokuapp.com/)
The hosted website does not contain any of the static material except the css files. Images could not be hosted on Heroku due to its ephemeral file management system. 
