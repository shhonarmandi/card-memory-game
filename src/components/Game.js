import Card from "./Card";
import { cardsData } from "../cards";
import { useCallback, useEffect, useState } from "react";

function Game() {
  const [stack, setStack] = useState([])
  const [cards, setCards] = useState(cardsData);
  const [foundPairCard, setFoundPairCard] = useState(0)
  const [maximumPairCrad] = useState(cardsData.length / 2)
  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    setStartTime(performance.now())
  }, [])

  const isStackFull = useCallback(() => {
    if (stack.length === 2) {
      return true
    }
  }, [stack])

  const isStackCardsEqual = useCallback(() => {
    if ((stack[0] % 2 === 0 && stack[0] - 1 === stack[1]) || (stack[1] % 2 === 0 && stack[1] - 1 === stack[0])) {
      setFoundPairCard(foundPairCard + 1)
      return true
    }
  }, [foundPairCard, stack])

  const flipStackCards = useCallback(() => {
    stack.forEach(element => {
      flipCard(element)
    });
    setStack([])
  }, [stack])

  const checkStackStatus = useCallback(() => {
    if (isStackFull()) {
      stack.sort();
      if (isStackCardsEqual()) {
        setStack([])
      } else {
        setTimeout(() => {
          flipStackCards()
        }, 1500)
      }
    }
  }, [isStackFull, isStackCardsEqual, flipStackCards, stack])

  const calculateTimeAndShowWinMessage = useCallback(() => {
    const endTime = performance.now();
    alert(`You win the game! your time was: ${msToHMS(endTime - startTime)}`)
  }, [startTime])

  useEffect(() => {
    checkStackStatus()
  }, [checkStackStatus])

  useEffect(() => {
    if (foundPairCard === maximumPairCrad) {
      calculateTimeAndShowWinMessage()
    }
  }, [maximumPairCrad, foundPairCard, calculateTimeAndShowWinMessage])

  const hasStackEnoughSpace = () => {
    if (stack.length < 2) {
      return true
    }
  }

  const msToHMS = (ms) => {
    let seconds = ms / 1000
    const hours = parseInt(seconds / 3600)
    seconds = seconds % 3600
    const minutes = parseInt(seconds / 60)
    seconds = seconds % 60
    return (`${hours}:${minutes}:${seconds.toFixed(3)}`);
  }

  const flipCard = (cardId) => {
    setCards(cards => cards.map(card => card.id === cardId ? ({ ...card, isFlipped: !card.isFlipped }) : card))
  }

  const handleOnCardClick = (e) => {
    const currentCardId = parseInt(e.target.parentElement.getAttribute('data-testid'));

    if (hasStackEnoughSpace()) {
      flipCard(currentCardId)
      setStack([...stack, currentCardId])
    }
  }

  return (
    <section className="memory-game">
      {
        cards && cards.map(card => {
          return <Card key={card.id} card={card} onClick={!card.isFlipped ? handleOnCardClick : undefined} />
        })
      }
    </section>
  );
}

export default Game;
