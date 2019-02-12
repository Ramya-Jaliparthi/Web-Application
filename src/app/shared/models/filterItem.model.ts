export class FilterItem {
  type?: string;
  selected: boolean;
  value: string;
  disabled: boolean;
  count: number;
  displayText: string;

  static getDefaultFilterItem(value: string, displayText?: string): FilterItem {
    const filterItem = new FilterItem();
    filterItem.selected = false;
    filterItem.disabled = false;
    filterItem.count = 0;
    filterItem.value = value;
    filterItem.displayText = displayText ? displayText : value;
    return filterItem;
  }
}
