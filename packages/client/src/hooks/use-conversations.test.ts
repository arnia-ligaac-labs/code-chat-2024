import { renderHook, act } from '@testing-library/react';
import useConversations from './use-conversations';
import { ESender } from '@code-chat-2024/types';

describe('useConversations', () => {
    test('should add a conversation', () => {
        const { result } = renderHook(() => useConversations());

        act(() => {
            result.current.addConversation();
        });

        expect(result.current.conversations).toHaveLength(1);
    });

    test('should remove a conversation', () => {
        const { result } = renderHook(() => useConversations());

        act(() => {
            result.current.addConversation();
        });

        act(() => {
            result.current.removeConversation(result.current.conversations[0].id); 
        });

        expect(result.current.conversations).toHaveLength(0);
    });

    test('should add a message to a conversation', () => {
        const { result } = renderHook(() => useConversations());

        act(() => {
            result.current.addConversation();
        });

        act(() => {
            result.current.addMessage(result.current.conversations[0].id, 'Hello', ESender.User);
        });

        expect(result.current.conversations[0].messages).toHaveLength(1);
        expect(result.current.conversations[0].messages[0].content).toBe('Hello');
        expect(result.current.conversations[0].messages[0].sender).toBe('User');
    });

    test('should update current conversation when selectedConversationId changes', () => {
        const { result, rerender } = renderHook(() => useConversations());

        act(() => {
            result.current.addConversation();
        });

        act(() => {
            result.current.setSelectedConversationId(result.current.conversations[0].id);
        });

        expect(result.current.selectedConversationId).toBeDefined();

        rerender();

        act(() => {
            result.current.setSelectedConversationId(null);
        });

        expect(result.current.selectedConversationId).toBeNull();
    });
});