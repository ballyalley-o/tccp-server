import { asyncHandler } from '@middleware'
import { ErrorResponse } from '@util'
import { User } from '@model'

//Get all users
//GET /api/v1/auth/users
//Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

//Get a user
//GET /api/v1/auth/users/:userId
//Private.=/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  res.status(200).json({
    success: true,
    message: 'User successfully fetched',
    data: user,
  })
})

//Get user friends
//GET /api/v1/auth/users/:userId/friends
//public
;(exports.getUserFriends = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    //find all users with id in user.friends
    const friends = await Promise.all(
      user.friends.map(async (id) => User.findById(id))
    )
    const formattedFriendsDetails = friends.map(
      ({ _id, firstName, lastName, role, picturePath, location }) => {
        return _id, firstName, lastName, role, picturePath, location
      }
    )
    res.status(200).json({
      success: true,
      message: 'User friends successfully fetched',
      data: formattedFriendsDetails,
    })
  } catch (error) {
    res.status(404).json({
      message: err.message,
    })
  }
})),
  //PUT add/remove user friends
  //PUT /api/v1/auth/users/:userId/friends
  //public
  (exports.addRemoveFriend = asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id)
      const friend = await User.findById(req.params.friendId)

      //check if friend is already in user.friends
      if (user.friends.includes(friendId)) {
        user.friends = user.friends.filter((id) => id !== friendId)
        friend.friends = friend.friends.filter((id) => id !== id)
      } else {
        user.friends.push(friendId)
        friend.friends.push(id)
      }
      await user.save()
      await friend.save()

      const friends = await Promise.all(
        user.friends.map(async (id) => User.findById(id))
      )
      const formattedFriendsDetails = friends.map(
        ({ _id, firstName, lastName, role, picturePath, location }) => {
          return { _id, firstName, lastName, role, picturePath, location }
        }
      )

      res.status(200).json({
        success: true,
        message: 'friends list successfully updated from the database',
        data: formattedFriendsDetails,
      })
    } catch (error) {
      res.status(404).json({
        message: err.message,
      })
    }
  })),
  //Create a new user
  //POST /api/v1/auth/users
  //Private/Admin
  (exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(201).json({
      success: true,
      message: 'User successfully created',
      data: user,
    })
  })),
  //Update a user
  //PUT/api/v1/auth/users/:id
  //Private/Admin
  (exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      message: 'User successfully updated from the database',
      data: user,
    })
  })),
  //Delete a user
  //PUT/api/v1/auth/users/:id
  //Private/Admin
  (exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: 'User successfully removed from the database',
      data: {},
    })
  }))
