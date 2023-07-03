import { Tag } from "@prisma/client";
import { db } from "../prismaClient";
import { TagWithUserAndPosts } from "../../../interfaces";

export async function readSpecificTagPosts(
  tagEntities: Tag[]
): Promise<TagWithUserAndPosts | null> {
  const specificTagPosts = await db.tag.findUnique({
    where: {
      id: tagEntities[1].id,
    },
    include: {
      tagsOnPosts: {
        include: {
          post: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  isAdmin: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!specificTagPosts || !specificTagPosts.tagsOnPosts) {
    return null;
  }

  return {
    id: specificTagPosts.id,
    name: specificTagPosts.name,
    posts: specificTagPosts.tagsOnPosts.map((tagOnPost) => {
      return {
        id: tagOnPost.post.id,
        imagePath: tagOnPost.post.imagePath,
        description: tagOnPost.post.description,
        user: {
          id: tagOnPost.post.user.id,
          name: tagOnPost.post.user.name,
          email: tagOnPost.post.user.email,
          isAdmin: tagOnPost.post.user.isAdmin,
        },
        createdAt: tagOnPost.post.createdAt,
        updatedAt: tagOnPost.post.updatedAt,
      };
    }),
    createdAt: specificTagPosts.createdAt,
    updatedAt: specificTagPosts.updatedAt,
  };
}
