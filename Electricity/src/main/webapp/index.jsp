<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Electricity Bill Calculator</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script>
$(document).ready(function(){

    $("form").submit(function(){

        if($("#units").val()=="" || $("#units").val()<=0){
            alert("Please enter valid units.");
            return false;
        }

    });

});
</script>

</head>

<body class="bg-light">

<div class="container mt-5">

<div class="card shadow">

<div class="card-header bg-primary text-white">
<h2>Electricity Bill Calculator</h2>
</div>

<div class="card-body">

<form action="BillServlet" method="post">

<div class="mb-3">
<label>Consumer Name</label>
<input type="text" class="form-control" name="name" required>
</div>

<div class="mb-3">
<label>Consumer Number</label>
<input type="text" class="form-control" name="number" required>
</div>

<div class="mb-3">
<label>Units Consumed</label>
<input type="number" class="form-control" id="units" name="units" required>
</div>

<button class="btn btn-success">Calculate Bill</button>

</form>

</div>

</div>

</div>

</body>
</html>