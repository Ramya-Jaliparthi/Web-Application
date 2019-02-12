import { Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatSidenav, MatRadioGroup, MatSelectionList, MatSelectionListChange, MatCalendar } from '@angular/material';
import { FilterItem } from '../../shared/models/filterItem.model';

@Injectable()
export class FilterService {
  item_array;
  item_order;
  ordered_array;

  constructor() {
    this.item_order = [{ 'category_id': 'Medical' }, { 'category_id': 'Dental' },
    { 'category_id': 'Vision' }, { 'category_id': 'Pharmacy' }, { 'category_id': 'All visits' }];
    this.item_order = this.item_order.map(p => p.category_id);
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  customDateInputKeyDownEvent(e) {
    const regexStr = '^[0-9]*$';
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    const regEx = new RegExp(regexStr);
    if (regEx.test(String.fromCharCode(e.keyCode))) {
      return;
    } else {
      e.preventDefault();
    }
  }

  convertInputStringToDate(inputDateString: string) {
    if (inputDateString) {
      inputDateString = inputDateString.replace(/[/]/g, '');
      if (inputDateString.length >= 4) {
        inputDateString = inputDateString.substring(0, 2) + '/' + inputDateString.substring(2, 4) + '/' + inputDateString.substring(4);
      } else if (inputDateString.length >= 2) {
        inputDateString = inputDateString.substring(0, 2) + '/' + inputDateString.substring(2, 4);
      }
      return inputDateString;
    }
    return null;
  }

  getFormatDateString(date) {
    return moment(date).format('L');
  }

  getMinimumFromDate() {
    const minFormDate = new Date();
    minFormDate.setFullYear(minFormDate.getFullYear() - 2);
    return minFormDate;
  }

  compareStringField(value1: string, value2: string) {
    if (value1 === value2) {
      return 0;
    }
    return value1 > value2 ? -1 : 1;
  }

  getDateCount(listOfDatesDiffInDays, dateSpan) {
    if (listOfDatesDiffInDays) {
      const filterList = listOfDatesDiffInDays.filter((item) => item <= dateSpan);
      return filterList ? filterList.length : 0;
    }
    return 0;
  }

  selectAllOptions(list, selectedValue: boolean, selectAllOptionIdentifier: string) {
    return list.map((listItem) => {
      listItem.selected = selectedValue;
      if (selectedValue) {
        listItem.selected = listItem.count > 0;
        listItem.disabled = listItem.value !== selectAllOptionIdentifier;
      } else {
        listItem.selected = false;
        listItem.disabled = listItem.count === 0;
      }

      return listItem;
    });
  }

  onSelectionChange(selectionListChange: MatSelectionListChange, selectAllOptionIdentifier: string, selectedList) {
    const changeEvent = selectionListChange.option;
    if (changeEvent && changeEvent.value === selectAllOptionIdentifier) {
      this.selectAllOptions(selectedList, changeEvent.selected, selectAllOptionIdentifier);
    } else {
      const selectedOption = selectedList.find((listItem) => changeEvent && listItem.value === changeEvent.value);
      if (selectedOption) {
        selectedOption.selected = changeEvent.selected;
      }
      if (changeEvent.selected) {
        // when the user wants to check all option if he selects all the other list items
        // if (changeEvent.selectionList.selectedOptions.selected.length === selectedList.length - 1) {
        //   this.checkSelectAllOptionIfAllSelected(selectedList, selectAllOptionIdentifier);
        // }
      } else {
        this.unCheckSelectAllOption(selectedList, selectAllOptionIdentifier);
      }
    }
  }

  unCheckSelectAllOption(list, selectedAllOptionIdentifier: string) {
    const selectedAllOption = list.find((listItem) => listItem.value === selectedAllOptionIdentifier);
    if (selectedAllOption && selectedAllOption.selected) {
      selectedAllOption.selected = false;
    }
    return list;
  }

  checkSelectAllOptionIfAllSelected(list, selectedAllOptionIdentifier: string) {
    const selectedAllOption = list.find((listItem) => listItem.value === selectedAllOptionIdentifier);
    if (selectedAllOption && !selectedAllOption.selected) {
      selectedAllOption.selected = true;
    }
    return list;
  }

  getListItems(property: string, list, selectAllOptionIdentifier: string, sorting?: boolean) {
    const itemsCount = this.getPropertyValuesWithCount(property, list);
    const listItems = [];
    for (const key of Object.keys(itemsCount)) {
      listItems.push({
        value: key,
        selected: false,
        count: itemsCount[key]
      });
    }
    if (listItems && listItems.length > 1) {
      listItems.push({
        value: selectAllOptionIdentifier,
        selected: false,
        count: list.length
      });
    }
    if (sorting) {
      this.mapOrder(listItems, this.item_order, 'value');
    }
    return listItems;
  }

  mapOrder(array, order, key) {
    array.sort(function (a, b) {
      const A = a[key], B = b[key];
      if (order.indexOf(A) > order.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }
    });
    return array;
  }

  getPropertyValuesWithCount(property: string, list) {
    const itemsCount = {};
    for (const listItem of list) {
      const propertyValue = listItem[property];
      itemsCount[propertyValue] = itemsCount[propertyValue] ? itemsCount[propertyValue] + 1 : 1;
    }
    return itemsCount;
  }

  updateListItemsWithCount(property: string, list, selectAllOptionIdentifier: string, listItems: FilterItem[]): FilterItem[] {
    const itemsCount = this.getPropertyValuesWithCount(property, list);
    for (const key of Object.keys(itemsCount)) {
      const listItem = listItems.find((item) => item.value === key);
      const notlistItem = listItems.find((item) => item.value !== key);
      if (listItem) {
        listItem.count = itemsCount[key] ? itemsCount[key] : 0;
      }
      if (notlistItem) {
        notlistItem.count = itemsCount[key] ? 0 : 0;
      }
    }
    if (listItems) {
      listItems = listItems.map((item) => {
        if (item.value === selectAllOptionIdentifier) {
          item.count = list.length;
        } else {
          item.disabled = item.count === 0;
        }
        return item;
      });
    }
    return listItems;
  }

  generateDependantString(selectionListChange: MatSelectionListChange): string {
    const selectedOptions = selectionListChange.source.selectedOptions.selected;
    if (selectedOptions && selectedOptions.length > 0) {
      return selectionListChange.source.selectedOptions.selected.map((selectedItem) => selectedItem.value).join();
    } else {
      return '';
    }
  }

  getSelectedItems(list: MatSelectionList) {
    if (list && list.selectedOptions.selected.length > 0) {
      return list.selectedOptions.selected.map((selectedItem) => selectedItem.value);
    }
    return null;
  }

  uniqueArray(array) {
    const j = {};
    array.forEach(function (item) {
      j[item + '::' + typeof item] = item;
    });
    return Object.keys(j).map(function (item) {
      return j[item];
    });
  }

}
