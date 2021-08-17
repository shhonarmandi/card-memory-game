import Card from "./Card";
import { cardsData } from "../cards";
import { useCallback, useEffect, useState } from "react";

function Game() {
  const [cards, setCards] = useState(cardsData);
  const [stack, setStack] = useState([])

  const compareStackCards = useCallback(() => {
    if ((stack[0] % 2 === 0 && stack[0] - 1 === stack[1]) || (stack[1] % 2 === 0 && stack[1] - 1 === stack[0])) {
      return true
    }
  }, [stack])

  const clearStack = useCallback(() => {
    stack.forEach(element => {
      flipCard(element)
    });
    setStack([])
  }, [stack]) 

  const checkStackStatus = useCallback(() => {
    if (stack.length === 2) {
      stack.sort();
      if (compareStackCards()) {
        setStack([])
      } else {
        setTimeout(() => {
          clearStack()
        }, 1500)
      }
    }
  }, [compareStackCards, clearStack, stack])

  useEffect(() => {
    checkStackStatus()
  }, [checkStackStatus])

  const isStackFull = () => {
    if (stack.length < 2) {
      return true
    }
  }

  const flipCard = (cardId) => {
    setCards(cards => cards.map(card => card.id === cardId ? ({ ...card, isFlipped: !card.isFlipped }) : card))
  }

  const handleOnCardClick = (e) => {
    const currentCardId = parseInt(e.target.parentElement.getAttribute('data-testid'));

    if (isStackFull()) {
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
