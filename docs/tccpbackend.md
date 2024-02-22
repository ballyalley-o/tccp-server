<html>
    <div align='right'>
        <img src='https://i.ibb.co/5B3rq3s/tccp-interlaced.png' alt='logo' height='100'>
    </div>
</html>
<!--
> ## the CodeCoach Projct [BACKEND]
>
> \[BACKEND\] support for _**"the CODE COACH Project"**_ application to handle the whole CRUD operations for bootcamps, courses, feedbacks, users, and authentication. -->

<!--- If we have only one group/collection, then no need for the "ungrouped" heading -->

# Endpoints

- [Endpoints](#endpoints)
  - [Bootcamps](#bootcamps)
    - [1. Get All Bootcamps](#1-get-all-bootcamps)
    - [2. Get a Single Bootcamp](#2-get-a-single-bootcamp)
    - [3. Get Bootcamps in Distance](#3-get-bootcamps-in-distance)
    - [4. Create New Bootcamp](#4-create-new-bootcamp)
    - [5. Update Bootcamp](#5-update-bootcamp)
    - [6. Delete Bootcamp](#6-delete-bootcamp)
    - [7. Upload Photo](#7-upload-photo)
  - [Courses](#courses)
    - [1. Get All Courses](#1-get-all-courses)
    - [2. Get Courses for Bootcamp](#2-get-courses-for-bootcamp)
    - [3. Get a Single Course](#3-get-a-single-course)
    - [4. Create New Course](#4-create-new-course)
    - [5. Update Course](#5-update-course)
    - [6. Delete Courses](#6-delete-courses)
  - [Authentication](#authentication)
    - [1. Register User](#1-register-user)
    - [2. Get Logged in User via Token](#2-get-logged-in-user-via-token)
    - [3. Login User](#3-login-user)
    - [4. Logout User](#4-logout-user)
    - [5. Forgot Password](#5-forgot-password)
    - [6. Reset Password](#6-reset-password)
    - [7. Update Details](#7-update-details)
    - [8. Update Password](#8-update-password)
    - [9. \[HACKING MONGO\]Login User](#9-hacking-mongologin-user)
  - [Users](#users)
    - [1. Get Users](#1-get-users)
    - [2. Get A User](#2-get-a-user)
    - [3. Create A User](#3-create-a-user)
    - [4. Update A User](#4-update-a-user)
    - [5. Delete A User](#5-delete-a-user)
  - [Feedbacks](#feedbacks)
    - [1. Get All Feedbacks](#1-get-all-feedbacks)
    - [2. Get Feedbacks for Bootcamp](#2-get-feedbacks-for-bootcamp)
    - [3. Get A Feedback](#3-get-a-feedback)
    - [4. Add A Feedback](#4-add-a-feedback)
    - [5. Update A Feedback](#5-update-a-feedback)
    - [6. Delete A Feedback](#6-delete-a-feedback)
  - [Club](#club)
    - [1. Posts](#1-posts)

---

## Bootcamps

Bootcamps CRUD functionality

### 1. Get All Bootcamps

Fetch all bootcamps from database. Includes pagination, filtering, etc

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/
```

### 2. Get a Single Bootcamp

Get single bootcamp by ID

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/
```

**_Query params:_**

| Key              | Value | Description |
| ---------------- | ----- | ----------- |
| averageCost[lte] | 10000 |             |

### 3. Get Bootcamps in Distance

Fetch all bootcamps within req. radius.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/radius/2013/1000
```

**_Headers:_**

| Key           | Value    | Description |
| ------------- | -------- | ----------- |
| location.city | auckland |             |

### 4. Create New Bootcamp

Add new bootcamp to database. Must be authenticated and must be publisher or admin.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
        "name": "TEST International-Bootcamp",
		"description": "IBM INTERNATIONAL BOOTCAMP is a full stack JavaScript Bootcamp located in the heart of Auckland that focuses on the technologies you need to get a high paying job as a web developer",
		"website": "https://IBMdev.com",
		"phone": "(111) 111-1111",
		"email": "enroll@IBMdev.com",
		"address": "123 Queen Street, New Llyn, Auckland 1053",
		"careers": [ "Web Development", "IBM Data Science", "Software QA", "UI/UX", "Business", "Back-end", "Dev Ops", "Software QA"],
		"housing": true,
		"jobAssistance": true,
		"jobGuarantee": false,
		"acceptGi": true
}
```

### 5. Update Bootcamp

Update single bootcamp in database

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/bootcamps/637171e86cca7790a92d5079
```

**_Body:_**

```js
{
    "name" : "Jose Mari Chan"
}
```

### 6. Delete Bootcamp

Delete bootcamp from database

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/bootcamps/5d725a037b292f5f8ceff787
```

### 7. Upload Photo

Uploading photo for bootcamps

**_Endpoint:_**

```bash
Method: PUT
Type: FORMDATA
URL: {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0
```

**_Body:_**

| Key | Value | Description |
| --- | ----- | ----------- |

| file
| | |

## Courses

Courses CRUD functionality

### 1. Get All Courses

Fetch all courses from database. Includes pagination, filtering, etc

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/courses
```

### 2. Get Courses for Bootcamp

Get courses populated with Bootcamp details

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/bootcamps/5d725a037b292f5f8ceff787/courses
```

### 3. Get a Single Course

Get single course by ID

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/courses/5d725cb9c4ded7bcb480eaa1
```

### 4. Create New Course

Add new course to database. Must be authenticated and must be publisher or admin.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d725a037b292f5f8ceff787/courses
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
        "title": "TEST Front End Webby Dev",
		"description": "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
		"weeks": 12,
		"tuition": 3400,
		"minimumSkill": "intermediate",
		"scholarhipsAvailable": true
}
```

### 5. Update Course

Update single course in database

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/courses/5d725a4a7b292f5f8ceff789
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
}
```

### 6. Delete Courses

Delete courses from database

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/courses/5d725c84c4ded7bcb480eaa0
```

## Authentication

Routes for user authentication including password and user auth

### 1. Register User

Add User to database with encrypted password

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/register
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "firstName": "Fakey2",
    "lastName": "person",
    "email": "fake2@gmail.com",
    "password": "123456",
    "role": "Student",
    "friends": [],
    "location":"Hamilton, NZ"
}
```

### 2. Get Logged in User via Token

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/auth/me
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

### 3. Login User

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "email":"john@gmail.com",
    "password":"123456"
}
```

### 4. Logout User

Log user out of the database.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/auth/logout
```

### 5. Forgot Password

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/reset_password/545e201081fca0a9dacbd28eab20cf2fc6d81b3e
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "email": "john@gmail.com"
}
```

### 6. Reset Password

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/reset_password/545e201081fca0a9dacbd28eab20cf2fc6d81b3e
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "password": "1234567"
}
```

### 7. Update Details

Updating the user's name and email.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/update_details
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "email": "martin@gmail.com",
    "name": "Martin"
}
```

### 8. Update Password

Updates logged-in user's password.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/auth/update_password
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "currentPassword": "1234567",
    "newPassword": "123456"
}
```

### 9. [HACKING MONGO]Login User

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/auth/login
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "email":{"$gt":""},
    "password":"123456"
}
```

## Users

Basic CRUD operations for dealing with users' details as Admin.

### 1. Get Users

Get All Users details. for Admin CRUD Operations.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/users
```

### 2. Get A User

Get a single User's details from the database, for Admin CRUD Operations.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/users/5d7a514b5d2c12c7449be046
```

### 3. Create A User

Create a single User to the database. restricted to Admin Operations.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/users
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "firstName": "Tony",
    "lastName": "Montana",
    "email": "mylittlefriend@gmail.com",
    "password": "123456",
    "role": "trainer",
    "friends": [],
    "location":"Miami, Florida, USA"

}
```

### 4. Update A User

Update a single User in the database. restricted to only Admins Operations.

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/users/639721016a8116b67bda43b0
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "name": "Tony Montana Jr",
    "email": "mylittlefriends@yahoo.com"
}
```

### 5. Delete A User

Delete a single User from the database. restricted to Admin Operations.

**_Endpoint:_**

```bash
Method: DELETE
Type: RAW
URL: {{URL}}/api/v1/users/639721016a8116b67bda43b0
```

## Feedbacks

Handling the feedbacks with CRUD operations.

### 1. Get All Feedbacks

Get ALL Feedbacks from the database.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/feedbacks
```

### 2. Get Feedbacks for Bootcamp

Fetch all reviews for a certain Bootcamp.

**_Endpoint:_**

```bash
Method: GET
Type: RAW
URL: {{URL}}/api/v1/bootcamps/63970631b4f4d2f8f646778c/feedbacks
```

### 3. Get A Feedback

Fetch a single Feedback from the database.

**_Endpoint:_**

```bash
Method: GET
Type:
URL: {{URL}}/api/v1/feedbacks/5d725a037b292f5f8ceff787
```

### 4. Add A Feedback

Leave a Feedback for the bootcamp.

**_Endpoint:_**

```bash
Method: POST
Type: RAW
URL: {{URL}}/api/v1/bootcamps/5d725a037b292f5f8ceff787/feedbacks
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

**_Body:_**

```js
{
    "title": "Great EXPERIENCE TEST!",
    "body": "Had a bad experience, please dont waste your time enrolling to this bootcamp!",
    "rating": 9
}

```

### 5. Update A Feedback

Update a feedback for the bootcamp

**_Endpoint:_**

```bash
Method: PUT
Type: RAW
URL: {{URL}}/api/v1/feedbacks/63984ee6f7cbe5921546a554
```

**_Headers:_**

| Key          | Value            | Description |
| ------------ | ---------------- | ----------- |
| Content-Type | application/json | JSON Type   |

### 6. Delete A Feedback

Delete a feedback for the bootcamp.

**_Endpoint:_**

```bash
Method: DELETE
Type:
URL: {{URL}}/api/v1/feedbacks/63984ee6f7cbe5921546a554
```

## Club

### 1. Posts

**_Endpoint:_**

```bash
Method:
Type:
URL:
```

---

[Back to top](#thecodecoach--project-backend)

> Generated at 2022-12-22 15:33:38 by [docgen](https://github.com/thedevsaddam/docgen)
