import { Button } from '@mui/material';

//FollowButton is a component, allowing a user to follow or unfollow another user
function FollowButton ( props ) {

  //calls backend to allow one user to follow another user
  const follow = async (userID) => {
    const response = await fetch(`http://localhost:5000/friend/follow/${userID}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': props.curUser.token
      },
    });
    if (response.status === 400) {
      alert("Error");
    }
    else {
      props.setReload(!props.reload)
    }
  }

  //calls backend to allow one user to unfollow another user
  const unfollow = async (userID) => {
    const response = await fetch(`http://localhost:5000/friend/unfollow/${userID}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': props.curUser.token
      },
    });
    if (response.status === 400) {
      alert("Error");
    }
    else {
      props.setReload(!props.reload)
    }
  }

  return (
    <>
      {
        props.isFollowed ?
        (<Button inline onClick={()=> unfollow(props.otherID)}>Unfollow</Button>):
        (<Button inline onClick={()=> follow(props.otherID)}>Follow</Button>)
      }
    </>
  )
}

export default FollowButton