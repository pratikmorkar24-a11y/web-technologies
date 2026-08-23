            </div>
        </div>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $("#bill-form").on("submit", function (event) {
            if (!this.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            $(this).addClass("was-validated");
        });
    </script>
</body>
</html>
