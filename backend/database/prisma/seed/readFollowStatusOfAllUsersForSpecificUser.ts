import { db } from "../prismaClient";
export async function readFollowStatusOfAllUsersForSpecificUser(): Promise<
  any[]
> {
  const targetId = 2;

  const users = await db.user.findMany();

  const userFollowStatuses = await Promise.all(
    users.map(async (user) => {
      const following = await db.follow.findFirst({
        where: {
          followerId: user.id,
          followeeId: targetId,
        },
      });

      const followedBy = await db.follow.findFirst({
        where: {
          followerId: targetId,
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
