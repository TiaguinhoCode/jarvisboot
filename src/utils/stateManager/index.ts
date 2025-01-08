// Tipagem
interface UserState {
  state: string;
  lastMessageTime: number;
}

const userStates: Record<string, UserState> = {};

export function getUserState(userId: string): UserState {
  if (!userStates[userId]) {
    userStates[userId] = { state: "default", lastMessageTime: 0 };
  }
  return userStates[userId];
}

export function setUserState(userId: string, newState: Partial<UserState>) {
  userStates[userId] = { ...userStates[userId], ...newState };
}

export function canSendMessage(
  lastMessageTime: number,
  cooldown: number = 2000 // cada 2s
): boolean {
  return Date.now() - lastMessageTime >= cooldown;
}
