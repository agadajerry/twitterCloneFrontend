import { ReactNode } from "react";

export interface InputPropInterface {
    type?: string ;
    className?: string;
    onChange: (e: any) => void;
    name: string;
    label?: string;
    placeholder: string;
    value: string;
}

export interface TextAreaPropInterface {
    className?: string;
    onChange: (e: any) => void;
    name: string;
    label?: string;
    placeholder: string;
    cols?: number;
    value: string;
}

export interface ButtonPropInterface {
  className?: string;
  onClick: () => void;
  type?: "button" | "submit" | "reset";
  children: ReactNode;
}

export interface memberObj {
  createdAt: string;
  id: string;
  members: eachMember[];
  updatedAt: string;
  _v?: number;
  _id: string;
}

export type eachMember = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  biodata: string;
  profilePic: string;
  createdAt: string;
  updatedAt: string;
  provider: string;
};

export interface Conversation {
  conversationId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bioData: string;
  profilePic: string;
}

export interface Message {
  messageId?: string;
  id: string;
  conversationId: string;
  senderId: eachMember;
  deleted?: Boolean;
  text: string;
  createdAt: string;
  updatedAt?: string;
  receiverId?: string;
}

export interface IMessage {
  conversationId: string;
  senderId: Id;
  text: string;
  createdAt: Date;
  id: string;
}

interface Id {
  _id: string;
}
