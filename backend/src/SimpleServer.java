import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class SimpleServer {
    static Map<String, Account> accounts = new HashMap<>();
    static Account currentUser = null;

    static class Account {
        String accNum, pin;
        double balance;

        Account(String a, String p, double b) {
            accNum = a;
            pin = p;
            balance = b;
        }
    }

    public static void main(String[] args) throws IOException {
        accounts.put("1001", new Account("1001", "1234", 5000));
        accounts.put("1002", new Account("1002", "5678", 3000));
        accounts.put("1003", new Account("1003", "9012", 7500));

        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/api/authenticate", exchange -> {
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = readBody(exchange);
                String accNum = getValue(body, "accountNumber");
                String pin = getValue(body, "pin");

                if (accounts.containsKey(accNum) && accounts.get(accNum).pin.equals(pin)) {
                    currentUser = accounts.get(accNum);
                    sendJson(exchange, "{\"success\": true, \"message\": \"Login successful\"}");
                } else {
                    sendJson(exchange, "{\"success\": false, \"message\": \"Invalid credentials\"}");
                }
            }
        });

        server.createContext("/api/balance", exchange -> {
            if (currentUser != null) {
                String json = String.format("{\"accountNumber\": \"%s\", \"balance\": %.2f}",
                        currentUser.accNum, currentUser.balance);
                sendJson(exchange, json);
            } else {
                sendJson(exchange, "{\"error\": \"Not authenticated\"}");
            }
        });

        server.createContext("/api/deposit", exchange -> {
            if ("POST".equals(exchange.getRequestMethod()) && currentUser != null) {
                String body = readBody(exchange);
                double amount = Double.parseDouble(getValue(body, "amount"));
                if (amount > 0) {
                    currentUser.balance += amount;
                    sendJson(exchange,
                            String.format(
                                    "{\"success\": true, \"newBalance\": %.2f, \"message\": \"Deposited: ₹%.2f\"}",
                                    currentUser.balance, amount));
                } else {
                    sendJson(exchange, "{\"error\": \"Invalid amount\"}");
                }
            }
        });

        server.createContext("/api/withdraw", exchange -> {
            if ("POST".equals(exchange.getRequestMethod()) && currentUser != null) {
                String body = readBody(exchange);
                double amount = Double.parseDouble(getValue(body, "amount"));
                if (amount > 0 && amount <= currentUser.balance) {
                    currentUser.balance -= amount;
                    sendJson(exchange,
                            String.format(
                                    "{\"success\": true, \"newBalance\": %.2f, \"message\": \"Withdrawn: ₹%.2f\"}",
                                    currentUser.balance, amount));
                } else {
                    sendJson(exchange, "{\"error\": \"Invalid amount or insufficient balance\"}");
                }
            }
        });

        server.createContext("/api/changepin", exchange -> {
            if ("POST".equals(exchange.getRequestMethod()) && currentUser != null) {
                String body = readBody(exchange);
                String oldPin = getValue(body, "oldPin");
                String newPin = getValue(body, "newPin");

                if (currentUser.pin.equals(oldPin) && newPin.length() >= 4) {
                    currentUser.pin = newPin;
                    sendJson(exchange, "{\"success\": true, \"message\": \"PIN changed successfully\"}");
                } else {
                    sendJson(exchange, "{\"error\": \"Invalid old PIN or new PIN too short\"}");
                }
            }
        });

        server.createContext("/api/logout", exchange -> {
            currentUser = null;
            sendJson(exchange, "{\"success\": true, \"message\": \"Logged out\"}");
        });

        server.createContext("/", exchange -> {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/"))
                path = "/index.html";

            File file = new File("frontend" + path);
            if (file.exists() && !file.isDirectory()) {
                byte[] content = readFile(file);
                exchange.getResponseHeaders().set("Content-Type", getContentType(path));
                exchange.sendResponseHeaders(200, content.length);
                exchange.getResponseBody().write(content);
                exchange.close();
            } else {
                String response = "Not found";
                exchange.sendResponseHeaders(404, response.length());
                exchange.getResponseBody().write(response.getBytes());
                exchange.close();
            }
        });

        server.setExecutor(null);
        server.start();
        System.out.println("Server started on http://localhost:8080");
    }

    static String readBody(HttpExchange e) throws IOException {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buf = new byte[1024];
        int len;
        while ((len = e.getRequestBody().read(buf)) != -1) {
            result.write(buf, 0, len);
        }
        return result.toString(StandardCharsets.UTF_8);
    }

    static String getValue(String body, String key) {
        for (String param : body.split("&")) {
            String[] kv = param.split("=");
            if (kv.length == 2 && kv[0].equals(key))
                return kv[1];
        }
        return "";
    }

    static byte[] readFile(File f) throws IOException {
        FileInputStream fis = new FileInputStream(f);
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buf = new byte[1024];
        int len;
        while ((len = fis.read(buf)) != -1) {
            result.write(buf, 0, len);
        }
        fis.close();
        return result.toByteArray();
    }

    static void sendJson(HttpExchange e, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        e.getResponseHeaders().set("Content-Type", "application/json");
        e.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        e.sendResponseHeaders(200, bytes.length);
        e.getResponseBody().write(bytes);
        e.close();
    }

    static String getContentType(String path) {
        if (path.endsWith(".html"))
            return "text/html";
        if (path.endsWith(".css"))
            return "text/css";
        if (path.endsWith(".js"))
            return "application/javascript";
        return "text/plain";
    }
}