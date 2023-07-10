import { db } from "../prismaClient";
export async function getUserFollowStatus(): Promise<any[]> {
  // get all users
  const users = await db.user.findMany();

  const userFollowStatuses = await Promise.all(
    users.map(async (user) => {
      // check if the user is following User2
      const following = await db.follow.findFirst({
        where: {
          followerId: user.id,
          followeeId: 2,
        },
      });

      // check if the user is followed by User2
      const followedBy = await db.follow.findFirst({
        where: {
          followerId: 2,
          followeeId: user.id,
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        follower: following !== null,
        followee: followedBy !== null,
      };
    })
  );

  return userFollowStatuses;
}
