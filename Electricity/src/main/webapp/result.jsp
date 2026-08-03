<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Electricity Bill</title>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body class="bg-light">

<div class="container mt-5">

<div class="card shadow">

<div class="card-header bg-success text-white">
<h2>Electricity Bill Details</h2>
</div>

<div class="card-body">

<table class="table table-bordered">

<tr>
<th>Consumer Name</th>
<td>${name}</td>
</tr>

<tr>
<th>Consumer Number</th>
<td>${number}</td>
</tr>

<tr>
<th>Units Consumed</th>
<td>${units}</td>
</tr>

<tr>
<th>Total Bill</th>
<td><strong>₹ ${bill}</strong></td>
</tr>

</table>

<a href="index.jsp" class="btn btn-primary">Calculate Another Bill</a>

</div>

</div>

</div>

</body>
</html>