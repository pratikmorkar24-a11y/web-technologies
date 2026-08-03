package com.bill;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/BillServlet")
public class BillServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String name = request.getParameter("name");
        String number = request.getParameter("number");
        int units = Integer.parseInt(request.getParameter("units"));

        double bill;

        if (units <= 50) {
            bill = units * 3.5;
        } else if (units <= 150) {
            bill = 50 * 3.5 + (units - 50) * 4.0;
        } else if (units <= 250) {
            bill = 50 * 3.5 + 100 * 4.0 + (units - 150) * 5.2;
        } else {
            bill = 50 * 3.5 + 100 * 4.0 + 100 * 5.2 + (units - 250) * 6.5;
        }

        request.setAttribute("name", name);
        request.setAttribute("number", number);
        request.setAttribute("units", units);
        request.setAttribute("bill", bill);

        RequestDispatcher dispatcher = request.getRequestDispatcher("result.jsp");
        dispatcher.forward(request, response);
    }
}