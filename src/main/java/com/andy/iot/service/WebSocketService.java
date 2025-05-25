package com.andy.iot.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;


@Service
public class WebSocketService extends TextWebSocketHandler {
    private final Set<WebSocketSession> sessions = Collections.newSetFromMap(new ConcurrentHashMap<>());
    private final ObjectMapper objectMapper = new ObjectMapper(); // Chuyển object -> JSON

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("WebSocket Connected: " + session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) {
        sessions.remove(session);
        System.out.println("WebSocket Disconnected: " + session.getId() + ", Status: " + status);
    }

    public void sendJson(Object data) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(data);
            broadcast(jsonMessage);
        } catch (JsonProcessingException e) {
            System.err.println("Error converting data to JSON: " + e.getMessage());
        }
    }

    private void broadcast(String message) {
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (IOException e) {
                    System.err.println("Error sending message to " + session.getId() + ": " + e.getMessage());
                    try {
                        session.close(); // Đóng session nếu có lỗi
                    } catch (IOException ex) {
                        System.err.println("Error closing session " + session.getId() + ": " + ex.getMessage());
                    }
                }
            }
        }
    }
}