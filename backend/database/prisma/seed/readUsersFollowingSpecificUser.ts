import { db } from "../prismaClient";

export async function readUsersFollowingSpecificUser() {
  // followerIdが3のユーザーがフォローされているユーザーを取得する
  const follows = await db.follow.findMany({
    where: {
      followeeId: 4,
    },
    include: {
      follower: true,
    },
  });

  console.log({ follows });
  // フォローされているユーザーだけのリストを作成する
  const followedUsers = follows.map((follow) => follow.follower);

  return followedUsers;
}
