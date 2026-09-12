package com.example.bookstore.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class SessionUtil {

    public static Long getUserId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object id = session.getAttribute("userId");
        return id == null ? null : (Long) id;
    }

    public static String getRole(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object role = session.getAttribute("role");
        return role == null ? null : role.toString();
    }

    public static boolean isAuthenticated(HttpServletRequest request) {
        return getUserId(request) != null;
    }

    public static boolean isAdmin(HttpServletRequest request) {
        return "admin".equals(getRole(request));
    }
}
