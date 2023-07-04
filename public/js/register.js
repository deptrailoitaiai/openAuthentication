document.getElementById("registration-form").addEventListener("submit", function(event) {
  
    // Get form values
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
  
    // Perform validation
    if (username.trim() === "" || email.trim() === "" || password.trim() === "") {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
  

});
  