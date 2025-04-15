function makeFriendsList(friends) {
  const listElement = document.createElement('ul');

    friends.forEach(friend => {
        const listItem = document.createElement('li');
        
        listItem.textContent = `${friend.firstName} ${friend.lastName}`;
        
        listElement.appendChild(listItem);
    });

    return listElement;
}
