package com.beeproof.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class NotificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipient;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(length = 50)
    private String category;

    @Column(nullable = false)
    private boolean isRead = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public NotificationEntity() {}

    public NotificationEntity(Long id, User recipient, String title, String message, String category, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.recipient = recipient;
        this.title = title;
        this.message = message;
        this.category = category;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public static NotificationEntityBuilder builder() { return new NotificationEntityBuilder(); }

    public static class NotificationEntityBuilder {
        private Long id;
        private User recipient;
        private String title;
        private String message;
        private String category;
        private boolean isRead = false;
        private LocalDateTime createdAt;

        public NotificationEntityBuilder id(Long id) { this.id = id; return this; }
        public NotificationEntityBuilder recipient(User recipient) { this.recipient = recipient; return this; }
        public NotificationEntityBuilder title(String title) { this.title = title; return this; }
        public NotificationEntityBuilder message(String message) { this.message = message; return this; }
        public NotificationEntityBuilder category(String category) { this.category = category; return this; }
        public NotificationEntityBuilder isRead(boolean isRead) { this.isRead = isRead; return this; }
        public NotificationEntityBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationEntity build() {
            return new NotificationEntity(id, recipient, title, message, category, isRead, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
