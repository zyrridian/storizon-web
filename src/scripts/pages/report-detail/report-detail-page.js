import {
  generateCommentsListEmptyTemplate,
  generateCommentsListErrorTemplate,
  generateLoaderAbsoluteTemplate,
  generateRemoveReportButtonTemplate,
  // generateReportCommentItemTemplate,
  generateReportDetailErrorTemplate,
  generateReportDetailTemplate,
  generateSaveReportButtonTemplate,
} from '../../templates';
import { createCarousel } from '../../utils';
import ReportDetailPresenter from './report-detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import Map from '../../utils/map';
import * as StorizonAPI from '../../data/api';
import Database from '../../data/database';

export default class ReportDetailPage {
  #presenter = null;
  #form = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
        </div>
      </section>
      
      <section class="container">
        <hr>
        <div class="report-detail__comments__container">
          <div class="report-detail__comments-form__container">
            <h2 class="report-detail__comments-form__title">Beri Tanggapan</h2>
            <form id="comments-list-form" class="report-detail__comments-form__form">
              <textarea name="body" placeholder="Beri tanggapan terkait story."></textarea>
              <div id="submit-button-container">
                <button class="btn" type="submit">Tanggapi</button>
              </div>
            </form>
          </div>
          <hr>
          <div class="report-detail__comments-list__container">
            <div id="report-detail-comments-list"></div>
            <div id="comments-list-loading-container"></div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new ReportDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: StorizonAPI,
      dbModel: Database,
    });

    // this.#setupForm();

    this.#presenter.showReportDetail();
    // this.#presenter.getCommentsList();
  }

  async populateReportDetailAndInitialMap(message, report) {
    document.getElementById('report-detail').innerHTML = generateReportDetailTemplate({
      // title: report.title,
      description: report.description,
      // damageLevel: report.damageLevel,
      photoUrl: report.photoUrl,
      lat: report.lat,
      lon: report.lon,
      placeName: report.placeName,
      name: report.name,
      createdAt: report.createdAt,
    });

    // Carousel images
    createCarousel(document.getElementById('images'));

    // Map
    await this.#presenter.showReportDetailMap();
    if (this.#map) {
      const reportCoordinate = [report.lat, report.lon];
      const markerOptions = { alt: report.name };
      const popupOptions = { content: report.name };
      this.#map.changeCamera(reportCoordinate);
      this.#map.addMarker(reportCoordinate, markerOptions, popupOptions);
    }

    // Actions buttons
    this.#presenter.showSaveButton();
    this.addNotifyMeEventListener();
  }

  populateReportDetailError(message) {
    document.getElementById('report-detail').innerHTML = generateReportDetailErrorTemplate(message);
  }

  // populateReportDetailComments(message, comments) {
  //   if (comments.length <= 0) {
  //     this.populateCommentsListEmpty();
  //     return;
  //   }

  //   const html = comments.reduce(
  //     (accumulator, comment) =>
  //       accumulator.concat(
  //         generateReportCommentItemTemplate({
  //           photoUrlCommenter: comment.commenter.photoUrl,
  //           nameCommenter: comment.commenter.name,
  //           body: comment.body,
  //         }),
  //       ),
  //     '',
  //   );

  //   document.getElementById('report-detail-comments-list').innerHTML = `
  //     <div class="report-detail__comments-list">${html}</div>
  //   `;
  // }

  // populateCommentsListEmpty() {
  //   document.getElementById('report-detail-comments-list').innerHTML =
  //     generateCommentsListEmptyTemplate();
  // }

  // populateCommentsListError(message) {
  //   document.getElementById('report-detail-comments-list').innerHTML =
  //     generateCommentsListErrorTemplate(message);
  // }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
    });
  }

  // #setupForm() {
  //   this.#form = document.getElementById('comments-list-form');
  //   this.#form.addEventListener('submit', async (event) => {
  //     event.preventDefault();

  //     const data = {
  //       body: this.#form.elements.namedItem('body').value,
  //     };
  //     await this.#presenter.postNewComment(data);
  //   });
  // }

  // postNewCommentSuccessfully(message) {
  //   console.log(message);

  //   this.#presenter.getCommentsList();
  //   this.clearForm();
  // }

  // postNewCommentFailed(message) {
  //   alert(message);
  // }

  clearForm() {
    this.#form.reset();
  }

  renderSaveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateSaveReportButtonTemplate();

    document.getElementById('report-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveReport();
      await this.#presenter.showSaveButton();
    });
  }

  saveToBookmarkSuccessfully(message) {
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
  }

  renderRemoveButton() {
    document.getElementById('save-actions-container').innerHTML =
      generateRemoveReportButtonTemplate();

    document.getElementById('report-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeReport();
      await this.#presenter.showSaveButton();
    });
  }

  removeFromBookmarkSuccessfully(message) {
    console.log(message);
  }

  removeFromBookmarkFailed(message) {
    alert(message);
  }

  addNotifyMeEventListener() {
    document.getElementById('report-detail-notify-me').addEventListener('click', () => {
      this.#presenter.notifyMe();
    });
  }

  showReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportDetailLoading() {
    document.getElementById('report-detail-loading-container').innerHTML = '';
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideCommentsLoading() {
    document.getElementById('comments-list-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Tanggapi
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Tanggapi</button>
    `;
  }
}
