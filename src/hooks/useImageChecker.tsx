import { TWEET_IMAGE_AVATAR } from "../constants/contants";

export function addDefaultSrc(ev: any) {
  ev.target.src = TWEET_IMAGE_AVATAR;
}
