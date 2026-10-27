export interface PostCardI {
_id: string
privacy: string
user: User
sharedPost: SharedPost
likes: string[]
createdAt: string
commentsCount: number
topComment: TopComment
sharesCount: number
likesCount: number
isShare: boolean
id: string
bookmarked: boolean
body : string
image : string
}
export interface User {
_id: string
name: string
username: string
photo: string
}

export interface SharedPost {
_id: string
body: string
image: string
privacy: string
user: User2
sharedPost: SharedPost
likes: string[]
createdAt: string
commentsCount: number
topComment: TopComment
sharesCount: number
likesCount: number
isShare: boolean
id: string
}
export interface User2 {
_id: string
name: string
username: string
photo: string
}

export interface TopComment {
_id: string
content: string
commentCreator: CommentCreator
post: string
parentComment: TopComment
likes: string[]
createdAt: string
image ?: string
}
export interface CommentCreator {
_id: string
name: string
username: string
photo: string
}