import { db } from "../prismaClient";

export async function readSpecificFollowees() {
  // followerIdが3のユーザーがフォローしているユーザーを取得する
  const follows = await db.follow.findMany({
    where: {
      followerId: 2,
    },
    include: {
      followee: true,
    },
  });

  // フォローしているユーザーだけのリストを作成する
  const followedUsers = follows.map((follow) => follow.followee);

  return followedUsers;
}
