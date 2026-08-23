<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Electricity Bill Calculator</title>

    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet" />

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <script>
      $(document).ready(function () {
        $("form").submit(function () {
          if ($("#units").val() == "" || $("#units").val() <= 0) {
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
          <div class="alert alert-light border mb-4">
            <div class="row g-2 small">
              <div class="col-md"><strong>Name:</strong> Pratik Morkar</div>
              <div class="col-md"><strong>Class:</strong> Third Year</div>
              <div class="col-md"><strong>Div:</strong> Your Division</div>
              <div class="col-md"><strong>PRN:</strong> Your PRN</div>
              <div class="col-md"><strong>Roll No:</strong> Your Roll No.</div>
            </div>
          </div>

          <form action="BillServlet" method="post">
            <div class="mb-3">
              <label>Consumer Name</label>
              <input type="text" class="form-control" name="name" required />
            </div>

            <div class="mb-3">
              <label>Consumer Number</label>
              <input type="text" class="form-control" name="number" required />
            </div>

            <div class="mb-3">
              <label>Units Consumed</label>
              <input
                type="number"
                class="form-control"
                id="units"
                name="units"
                required />
            </div>

            <button class="btn btn-success">Calculate Bill</button>
          </form>
        </div>
      </div>
    </div>
  </body>
</html>
