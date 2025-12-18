package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.entity.Message;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.MessageRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message(sender, receiver, content);
        return messageRepository.save(message);
    }

    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversation(user1Id, user2Id);
    }

    public List<Message> getUnreadMessages(Long userId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(userId);
    }

    public void markMessagesAsRead(Long receiverId, Long senderId) {
        List<Message> unreadMessages = messageRepository.findByReceiverIdAndIsReadFalse(receiverId)
                .stream()
                .filter(msg -> msg.getSender().getId().equals(senderId))
                .collect(Collectors.toList());

        for (Message message : unreadMessages) {
            message.setIsRead(true);
            message.setReadAt(LocalDateTime.now());
        }

        messageRepository.saveAll(unreadMessages);
    }

    public List<Message> getChatList(Long userId) {
        return messageRepository.findLatestMessagesByUserId(userId);
    }
}
