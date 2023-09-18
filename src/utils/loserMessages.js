export const getRandomLoserMessage = (isPlayerLoser) => {
  const messages = isPlayerLoser
    ? [
        "I will eat you next time!",
        "You will see me again!",
        "Don't think you've won for good!",
        "You can't escape me forever!",
        "You got lucky this time!",
        "Your days are numbered!",
        "This isn't over!",
        "I'll get you next time, no doubt!",
        "You won the battle, not the war!",
        "Next time, you won't be so fortunate!",
      ]
    : [
        "I'll get you next time!",
        "You were lucky!",
        "You can't outsmart me forever!",
        "You're just postponing the inevitable!",
        "I'll be back, stronger!",
        "You'll slip up eventually!",
        "Just a temporary setback!",
        "Victory will be mine!",
        "Don't get too comfortable!",
        "You haven't seen the last of me!",
      ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
