<?php
require_once __DIR__ . "/includes/functions.php";

$name = "";
$consumerNumber = "";
$unitsInput = "";
$bill = null;
$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"] ?? "");
    $consumerNumber = trim($_POST["consumer_number"] ?? "");
    $unitsInput = trim($_POST["units"] ?? "");
    $error = validateBillInput($name, $consumerNumber, $unitsInput);

    if ($error === "") {
        $units = (int) $unitsInput;
        $bill = calculateBill($units);
    }
}

require_once __DIR__ . "/includes/header.php";
?>
                <?php if ($error !== ""): ?>
                    <div class="alert alert-danger" role="alert">
                        <?= escapeValue($error) ?>
                    </div>
                <?php endif; ?>

                <form method="post" id="bill-form" novalidate>
                    <div class="mb-3">
                        <label for="name" class="form-label">Consumer Name</label>
                        <input type="text" class="form-control" id="name" name="name" value="<?= escapeValue($name) ?>" required>
                        <div class="invalid-feedback">Please enter the consumer name.</div>
                    </div>

                    <div class="mb-3">
                        <label for="consumer-number" class="form-label">Consumer Number</label>
                        <input type="text" class="form-control" id="consumer-number" name="consumer_number" value="<?= escapeValue($consumerNumber) ?>" required>
                        <div class="invalid-feedback">Please enter the consumer number.</div>
                    </div>

                    <div class="mb-4">
                        <label for="units" class="form-label">Units Consumed</label>
                        <input type="number" class="form-control" id="units" name="units" min="1" step="1" value="<?= escapeValue($unitsInput) ?>" required>
                        <div class="invalid-feedback">Enter a positive whole number of units.</div>
                    </div>

                    <button type="submit" class="btn btn-success">Calculate Bill</button>
                </form>

                <?php if ($bill !== null): ?>
                    <section class="mt-4" aria-labelledby="result-heading">
                        <h2 id="result-heading" class="h4">Electricity Bill Details</h2>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <tbody>
                                    <tr><th scope="row">Consumer Name</th><td><?= escapeValue($name) ?></td></tr>
                                    <tr><th scope="row">Consumer Number</th><td><?= escapeValue($consumerNumber) ?></td></tr>
                                    <tr><th scope="row">Total Consumption</th><td><?= $units ?> units</td></tr>
                                    <tr><th scope="row">Total Bill</th><td><strong>₹ <?= number_format($bill, 2) ?></strong></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                <?php endif; ?>

<?php require_once __DIR__ . "/includes/footer.php"; ?>
