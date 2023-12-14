import { User, Follower, Post, Like, Comment, Listen} from '../server/dbmodels'

export const getTagsByEngagement = async(userId) => {
  try{
    //get liked tags
    const userLikesData:any = await Like.findAll({
      where: {
        userId
      },
      include: { model: Post,
        as: 'post'}
    })
    const userLikedTagObj = userLikesData
    .flatMap((like) => like.dataValues.post.dataValues.categories )
    .reduce((acc, curr) =>  {
      acc[curr] ? acc[curr] += 1 : acc[curr] = 1
      return acc
    }, {})

    //get listened tags
    const userListensData = await Listen.findAll({
      where: {
        userId
      },
      include: Post
    })
    const userListenedTagObj = userListensData
    .flatMap((listen) => listen.dataValues.Post.dataValues.categories )
    .reduce((acc, curr) =>  {
      acc[curr] ? acc[curr] += 1 : acc[curr] = 1
      return acc
    }, {})

    //get commented tags
    const userCommentData = await Comment.findAll({
      where: {
        userId
      },
      include: Post
    })
    const userCommentedTagObj = userCommentData
    .flatMap((comment) => comment.dataValues.Post.dataValues.categories)
    .reduce((acc, curr) =>  {
      acc[curr] ? acc[curr] += 1 : acc[curr] = 1
      return acc
    }, {})

    //combine tag rankings 
    let rankedTags = {}
    for(let key in userLikedTagObj){
      rankedTags[key] ? rankedTags[key] += userLikedTagObj[key] : rankedTags[key] = userLikedTagObj[key]
    }

    for(let key in userCommentedTagObj){
      rankedTags[key] ? rankedTags[key] += (.25 * userCommentedTagObj[key]) : rankedTags[key] = (.25 * userCommentedTagObj[key])
    }

    for(let key in userListenedTagObj){
      rankedTags[key] ? rankedTags[key] += (.05 * userListenedTagObj[key]) : rankedTags[key] = (.05 * userListenedTagObj[key])
    }

  return rankedTags
  }catch(error){
    console.error('[algorithmHelpers.ts] tag ranking error:', error)
  }
}