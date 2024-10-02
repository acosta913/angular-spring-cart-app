import { createReducer, on } from "@ngrx/store";
import { add, remove, total } from "./items.action";
import { ItemCard } from "../models/itemCart";

export interface ItemsState {
    items: ItemCard[],
    total: number
}
export const initialState: ItemsState = {
    items: JSON.parse(sessionStorage.getItem('cardList') || '[]'),
    total: 0,
};

export const itemsReducer = createReducer(
    initialState,
    on(add, (state, { product }) => {
        const hasItem = state.items.find((item: ItemCard) => item.product.id === product.id);
        if (hasItem) {
            return {
                items: state.items.map((item: ItemCard) => {
                    if (item.product.id === product.id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1
                        }
                    }
                    return item;
                }),
                total: state.total
            }
        } else {
            return {
                items: [...state.items, { product: { ...product }, quantity: 1 }],
                total: state.total
            };
        }
    }),
    on(remove, (state, { id }) => {
        return {
            items: state.items.filter((item: ItemCard) => item.product.id !== id),
            total: state.total
        };
    }),
    on(total, state => {
        return {
            items: state.items,
            total: state.items.reduce((total, item) => total + (item.quantity * item.product.price), 0)
        }
    })
)