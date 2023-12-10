
const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

  const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
  // Function to validate Firstname and Lastname
  function validateName() {
    const fullnameInput = document.getElementById("fullname");
    const names = fullnameInput.value.trim().split(" ");
    const errorElement = document.getElementById("fullnameError");
    if (names.length !== 2 ) {
      errorElement.textContent = "โปรดกรอก ชื่อจริง และ นามสกุล (เว้นชื่อจริงกับนามสกุล)";
      setError(fullnameInput , 'โปรดกรอก ชื่อจริง และ นามสกุล (เว้นชื่อจริงกับนามสกุล)');
      return false;
    }else {
        errorElement.textContent = ""; // Clear the error message when valid
        setSuccess(fullnameInput);
      }
      return true;
    }
    

  // Function to validate Student ID
  function validateStudentID() {
    const studentIDInput = document.getElementById("studentID");
    const studentIDPattern = /^66096\d{5}$/;
    const errorElement = document.getElementById("studentIDError");

    if (!studentIDPattern.test(studentIDInput.value)) {
      errorElement.textContent = "กรอกรหัสนักศึกษาทั้งหมด 10 หลัก";
      setError(studentIDInput , 'กรอกรหัสนักศึกาาทั้งหมด 10 หลัก');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      setSuccess(studentIDInput);
    }
    return true;
  }

  function validateThaiid() {
    const thaiidinput = document.getElementById("thai");
    const thaiidpattern = /^1\d{12}$/;
    const errorElement = document.getElementById("thaierror");

    if (!thaiidpattern.test(thaiidinput.value)) {
      errorElement.textContent = "โปรดกรอกให้ครบ 13 หลัก.";
      setError(thaiidinput , 'โปรดกรอกให้ครบ 13 หลัก.');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      setSuccess(thaiidinput);
    }
    return true;
  } 
  
  // Function to validate University Email
  function validateEmail() {
    const emailInput = document.getElementById("email");
    const emailPattern = /^.+@dome\.tu\.ac\.th$/;
    const errorElement = document.getElementById("emailError");
  
    if (!emailPattern.test(emailInput.value)) {
      errorElement.textContent =
        "ได้โปรดกรอกตาม format นี้ => 'xxx.yyy@dome.tu.ac.th'.";
        setError(emailInput, 'ได้โปรดกรอกตาม format นี้ => "xxx.yyy@dome.tu.ac.th".');
      return false;
    } else {
      errorElement.textContent = ""; // Clear the error message when valid
      setSuccess(emailInput);
    }
    return true;
  }

  function validateCheckbox() {
    const checkbox = document.getElementById("agreeCheckbox");
    const checkboxErrorElement = document.getElementById("agreeCheckboxError");

    if (!checkbox.checked) {
        checkboxErrorElement.textContent = "Please agree to the terms and conditions.";
        setError(checkbox, "Please agree to the terms and conditions.");
        return false;
    } else {
        checkboxErrorElement.textContent = ""; // Clear the error message when valid
        setSuccess(checkbox);
    }
    return true;
}
  
  // Function to validate form inputs on user input
  function validateFormOnInput() {
    validateName();
    validateStudentID();
    validateEmail();
    validateThaiid();
    validateCheckbox();
  }
  
  // Function to fetch activity types from the backend
  async function fetchActivityTypes() {
    try {
      const response = await fetch(config.backendUrl + "getActivityType");
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to fetch activity types.");
        return [];
      }
    } catch (error) {
      console.error("An error occurred while fetching activity types:", error);
      return [];
    }
  }
  
  // Function to populate activity types in the select element
  function populateActivityTypes(activityTypes) {
    const activityTypeSelect = document.getElementById("activityType");
  
    for (const type of activityTypes) {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.value;
      activityTypeSelect.appendChild(option);
    }
  }
  
  // Event listener when the page content has finished loading
  document.addEventListener("DOMContentLoaded", async () => {
    const activityTypes = await fetchActivityTypes();
    populateActivityTypes(activityTypes);
  });
  
  // Function to submit the form
  // Function to submit the form
  async function submitForm(event) {
    event.preventDefault();
  
    // Validate form inputs before submission
    if (!validateName() || !validateStudentID() || !validateEmail() || !validateThaiid()) {
      return;
    }
  
    const startDateInput = document.getElementById("startDate").value;
    const endDateInput = document.getElementById("endDate").value;
    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);
  
    if (endDate <= startDate) {
      alert("End datetime should be after the start datetime.");
      setError(endDateInput , 'Please enter both your Firstname and Lastname.');
      return;
    }
  
    // Create the data object to send to the backend
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get("fullname").split(" ")[0],
      last_name: formData.get("fullname").split(" ")[1],
      student_id: parseInt(formData.get("studentID")),
      thai_id: parseInt(formData.get("thai")),
      email: formData.get("email"),
      type_of_work_id: parseInt(formData.get("activityType")),
      semester: parseInt(formData.get("semester")),
      start_date: formData.get("startDate"),
      location: formData.get("location"),
      description: formData.get("description")
    };
  
    console.log(data);
  
    try {
      // Send data to the backend using POST request
      const response = await fetch(config.backendUrl + "record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Form data submitted successfully!");
  
        // Format JSON data for display
        const formattedData = Object.entries(responseData.data)
          .map(([key, value]) => `"${key}": "${value}"`)
          .join("\n");
  
        // Display success message with formatted data
        alert(responseData.message + "\n" + formattedData);
  
        document.getElementById("myForm").reset();
      } else {
        console.error("Failed to submit form data.");
  
        // Display error message
        alert("Failed to submit form data. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred while submitting form data:", error);
    }
  }
  
  // Event listener for form submission
  document.getElementById("myForm").addEventListener("submit", submitForm);
  
  // Event listeners for input validation on user input
  document.getElementById("fullname").addEventListener("input", validateName);
  document
    .getElementById("studentID")
    .addEventListener("input", validateStudentID);
  document.getElementById("thai").addEventListener("input",validateThaiid);
  document.getElementById("email").addEventListener("input", validateEmail);
  document.getElementById("agreeCheckbox").addEventListener("change", validateCheckbox);
  //Update
  document.addEventListener('DOMContentLoaded', function () {
  // เพิ่ม event listener สำหรับการ submit ฟอร์ม
  document.getElementById('myForm').addEventListener('submit', function (event) {
    // ตรวจสอบข้อมูลที่กรอก
    var fullname = document.getElementById('fullname').value;
    var studentID = document.getElementById('studentID').value;
    var thai = document.getElementById('thai').value;
    var email = document.getElementById('email').value;
    var activityType = document.getElementById('activityType').value;
    var semester = document.getElementById('semester').value;
    var startDate = document.getElementById('startDate').value;
    var location = document.getElementById('location').value;
    var description = document.getElementById('description').value;

    // ตรวจสอบว่ามีข้อมูลที่ไม่ถูกกรอกหรือไม่
    if (
      fullname === '' ||
      studentID === '' ||
      thai ==='' ||
      email === '' ||
      activityType === '' ||
      semester === '' ||
      startDate === '' ||
      location === '' ||
      description === ''
    ) {
      // แสดง alert เมื่อข้อมูลไม่ครบ
      alert('ข้อมูลยังไม่ถูกต้อง หรือ กรอกไม่ครบนะ ลองกรอกใหม่ให้ตรงด้วย >< ');
      // ยกเลิกการ submit ฟอร์ม
      event.preventDefault();
    }
  });
});


document.addEventListener('DOMContentLoaded', function () {
  // Add event listener for form submission
  document.getElementById('myForm').addEventListener('submit', function (event) {
    // Validate the form data here

    // If the form data is valid, you can submit the form and then reset it
    if (validateForm()) {
      // Perform any necessary actions (e.g., submit the form to a server)

      // Reset the form
      document.getElementById('myForm').reset();

      // Prevent the default form submission behavior
      event.preventDefault();
    }
  });

  // Function to validate form data
  function validateForm() {
    return true;
  }
  const output1 = document.getElementById('output1');
  const output2 = document.getElementById('output2');
  const output3 = document.getElementById('output3');
  const output4 = document.getElementById('output4');
  const output5 = document.getElementById('output5');
  const output6 = document.getElementById('output6');
  const output7 = document.getElementById('output7');
  const output8 = document.getElementById('output8');
  const output9 = document.getElementById('output9');
  const output10 = document.getElementById('output10');
  const submit = document.getElementById('submit');
  const fullname = document.getElementById('fullname');
  const studentID = document.getElementById('studentID');
  const thai = document.getElementById('thai');
  const email = document.getElementById('email');
  const activityType = document.getElementById('activityType');
  const semester = document.getElementById('semester');
  const startDate = document.getElementById('startDate');
  const location = document.getElementById('location');
  const description = document.getElementById('description');


  function  all(){
     output1.innerHTML = 'Thank you for submitting the information ! ';
     output2.innerHTML = 'Your Name : --  ' + fullname.value;
     output3.innerHTML = 'Your Student ID  : --  ' + studentID.value;
     output4.innerHTML = 'Your Thai ID : --  ' + thai.value;
     output5.innerHTML = 'Your Email : --  ' + email.value;
     output6.innerHTML = 'Your Activity that you choose : --  ' + activityType.value;
     output7.innerHTML = 'Your Semester : --  ' + semester.value;
     output8.innerHTML = 'Your Date : --  ' + startDate.value;
     output9.innerHTML = 'Your Location : --  ' + location.value;
     output10.innerHTML = 'Your Comment  :  --  ' + description.value;
    
  }
  submit.addEventListener('click',all);
});