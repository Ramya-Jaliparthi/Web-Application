import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDocumentsFoundComponent } from './no-documents-found.component';
import { MessageCenterNoDocsFoundPageModelInterface } from '../modals/interfaces/message-center.interface';
import { MessageCenterUtilities } from '../utils/message-center.utilities';
import { MessageCenterConstants } from '../constants/messageCenter.constants';
import {
  DynamicPromotionalContentComponent
} from '../../../shared/components/dynamic-promotional-content/dynamic-promotional-content.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('NoDocumentsFoundComponent', () => {
  let noDocumentsFoundComponent: NoDocumentsFoundComponent;
  let child_dynamicPromotionalContentComponent: DynamicPromotionalContentComponent;
  const utils: MessageCenterUtilities = new MessageCenterUtilities();
  let fixture: ComponentFixture<NoDocumentsFoundComponent>;
  let childFixture: ComponentFixture<DynamicPromotionalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoDocumentsFoundComponent, DynamicPromotionalContentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDocumentsFoundComponent);
    childFixture = TestBed.createComponent(DynamicPromotionalContentComponent);

    noDocumentsFoundComponent = fixture.componentInstance;

    child_dynamicPromotionalContentComponent = childFixture.componentInstance;

  });

  describe('NoDocumentsFoundComponent', () => {
    describe('Component Architecture', () => {
      it('should have been created', () => {
        noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
        fixture.detectChanges();
        expect(noDocumentsFoundComponent).toBeTruthy();
      });

      it('should have declared "messageCenterNoDocsFoundPageModel"', () => {
        noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
        fixture.detectChanges();
        expect(utils.hasOwnPropertyCheck(noDocumentsFoundComponent, 'messageCenterNoDocsFoundPageModel'))
          .toBeTruthy();
      });

      it('"messageCenterNoDocsFoundPageModel" property must be of type "MessageCenterNoDocumentsFoundPageModel"', () => {
        noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
        fixture.detectChanges();
        expect(noDocumentsFoundComponent.messageCenterNoDocsFoundPageModel.constructor.name).toBe("MessageCenterNoDocumentsFoundPageModel");
      });

      it('should have declared @Input "componentMode"', () => {
        noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
        fixture.detectChanges();
        expect(utils.hasOwnPropertyCheck(noDocumentsFoundComponent, 'componentMode')).toBeTruthy();
      });

      it('@Input "componentMode" should be of type string', () => {
        noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
        fixture.detectChanges();
        expect(noDocumentsFoundComponent.componentMode.constructor.name).toBe('String');
      });


      describe('Child Component - DynamicPromotionalContentComponent', () => {
        it('should have been created', () => {
          noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
          fixture.detectChanges();
          expect(child_dynamicPromotionalContentComponent).toBeTruthy();
        });
      });

      describe('When component mode changes ', () => {

        describe(`When component mode is ${MessageCenterConstants.flags.documentsMode}`, () => {

          it('"messageCenterNoDocsFoundPageModel" property must be of type "MessageCenterNoDocumentsFoundPageModel"', () => {
            noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.documentsMode;
            fixture.detectChanges();

            expect(noDocumentsFoundComponent.messageCenterNoDocsFoundPageModel.constructor.name).toBe("MessageCenterNoDocumentsFoundPageModel");
          });
        });

        describe(`When component mode is ${MessageCenterConstants.flags.uploadsMode}`, () => {

          it('"messageCenterNoDocsFoundPageModel" property must be of type "MessageCenterNoUploadsFoundPageModel"', () => {
            noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.uploadsMode;
            fixture.detectChanges();

            expect(noDocumentsFoundComponent.messageCenterNoDocsFoundPageModel.constructor.name).toBe("MessageCenterNoUploadsFoundPageModel");
          });
        });

        describe(`When component mode is ${MessageCenterConstants.flags.messagesMode}`, () => {

          it('"messageCenterNoDocsFoundPageModel" property must be of type "MessageCenterNoMessagesFoundPageModel"', () => {
            noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.messagesMode;
            fixture.detectChanges();

            expect(noDocumentsFoundComponent.messageCenterNoDocsFoundPageModel.constructor.name).toBe("MessageCenterNoMessagesFoundPageModel");
          });
        });

        describe(`When component mode is ${MessageCenterConstants.flags.planDocumentsMode}`, () => {

          it('"messageCenterNoDocsFoundPageModel" property must be of type "MessageCenterNoPlanDocumentsFoundPageModel"', () => {
            noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.planDocumentsMode;
            fixture.detectChanges();

            expect(noDocumentsFoundComponent.messageCenterNoDocsFoundPageModel.constructor.name).toBe("MessageCenterNoPlanDocumentsFoundPageModel");
          });
        });

        describe(`When component mode is an unknown entity`, () => {

          // it(`it should throw an error with message ${MessageCenterConstants.errorMessages.noDocsFound_InvalidComponentModeError}`, () => {
          //   noDocumentsFoundComponent.componentMode = "unknown";
          //   expect(fixture.detectChanges).toThrow();

          //   expect( noDocumentsFoundComponent.ngOnInit ).toThrowError(MessageCenterConstants.errorMessages.noDocsFound_InvalidComponentModeError);
          // });
          it(`it should throw an error `, () => {
            noDocumentsFoundComponent.componentMode = "unknown";
            expect(fixture.detectChanges).toThrow();
          });
        });
      });
    });

    describe('Spec Definitions', () => {
      describe('HTML Specifications', () => {
        describe(`${MessageCenterConstants.flags.messagesMode} mode`, () => {
          beforeEach(() => {
            noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.messagesMode;
            fixture.detectChanges();
          });

          it("Component header should be 'Messages'", () => {
            const bannerDe: DebugElement = fixture.debugElement;
            const bannerEl: HTMLElement = bannerDe.nativeElement;
            const h1 = bannerEl.querySelector('h1');
            expect(h1.textContent).toEqual('Messages');
          });
        });
      });

      describe('CSS Specifications', () => {
        describe(`${MessageCenterConstants.flags.messagesMode} mode`, () => {
          beforeEach(() => {
            noDocumentsFoundComponent.componentMode = MessageCenterConstants.flags.messagesMode;
            fixture.detectChanges();
          });
          describe(`h1 tag styles`, () => {
            it("Component header h1 tag's font should be Roboto", () => {
              const fixtureSourceElement: DebugElement = fixture.debugElement;
              const titleFixtureElement = fixtureSourceElement.query(By.css('h1'));
              const header1: HTMLElement = titleFixtureElement.nativeElement;
              expect(window.getComputedStyle(header1, null).getPropertyValue("font-family")).toEqual('Roboto');
            });
          });
        });
      });
    });
  });

});
