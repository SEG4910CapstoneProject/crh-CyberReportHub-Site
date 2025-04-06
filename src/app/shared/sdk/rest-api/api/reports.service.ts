/**
 * CyberReportHub API
 * The API to interact with CyberReportHub
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */ /* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

import { Observable } from 'rxjs';

import { JsonReportResponse } from '../model/jsonReportResponse';
import { JsonReportSuggestionsResponse } from '../model/jsonReportSuggestionsResponse';
import { SearchReportResponse } from '../model/searchReportResponse';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class ReportsService {
  createReport(arg0: any) {
    throw new Error('Method not implemented.');
  }
  protected basePath = 'http://localhost:51009';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add articles to report
   * This endpoint adds the articles specified in request body to the report
   * @param body
   * @param id The report id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public addArticlesToReport(
    body: Array<string>,
    id: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public addArticlesToReport(
    body: Array<string>,
    id: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public addArticlesToReport(
    body: Array<string>,
    id: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public addArticlesToReport(
    body: Array<string>,
    id: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling addArticlesToReport.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling addArticlesToReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/addArticle`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Add article to report
   * This endpoint adds the specified article to the report
   * @param id The report id
   * @param articleId The article id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public addSingleArticleToReport(
    id: number,
    articleId: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public addSingleArticleToReport(
    id: number,
    articleId: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public addSingleArticleToReport(
    id: number,
    articleId: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public addSingleArticleToReport(
    id: number,
    articleId: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling addSingleArticleToReport.'
      );
    }

    if (articleId === null || articleId === undefined) {
      throw new Error(
        'Required parameter articleId was null or undefined when calling addSingleArticleToReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/addArticle/${encodeURIComponent(String(articleId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Add statistic to report
   * This endpoint adds the specified statistic to the report
   * @param id The report id
   * @param statisticId The statistic id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public addSingleStatToReport(
    id: number,
    statisticId: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public addSingleStatToReport(
    id: number,
    statisticId: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public addSingleStatToReport(
    id: number,
    statisticId: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public addSingleStatToReport(
    id: number,
    statisticId: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling addSingleStatToReport.'
      );
    }

    if (statisticId === null || statisticId === undefined) {
      throw new Error(
        'Required parameter statisticId was null or undefined when calling addSingleStatToReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/addStat/${encodeURIComponent(String(statisticId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Add statistics to report
   * This endpoint adds the statistics specified in request body to the report
   * @param body
   * @param id The report id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public addStatsToReport(
    body: Array<string>,
    id: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public addStatsToReport(
    body: Array<string>,
    id: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public addStatsToReport(
    body: Array<string>,
    id: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public addStatsToReport(
    body: Array<string>,
    id: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling addStatsToReport.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling addStatsToReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/addStat`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Removes an article or statistic as a suggestion to a report
   * Removes an article or statistic as a suggestion to a report
   * @param id The report id
   * @param articleId
   * @param statId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public deleteReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public deleteReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public deleteReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling deleteReportSuggestions.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (articleId !== undefined && articleId !== null) {
      queryParameters = queryParameters.set('articleId', <any>articleId);
    }
    if (statId !== undefined && statId !== null) {
      queryParameters = queryParameters.set('statId', <any>statId);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'delete',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/suggestions`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Gets the id of the latest report
   * Gets the id of the latest report
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getLatestId(
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<string>;
  public getLatestId(
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<string>>;
  public getLatestId(
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<string>>;
  public getLatestId(
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['text/plain', '*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<string>(
      'get',
      `${this.basePath}/api/v1/reports/latestId`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Returns latest report in desired format if any exists
   * This endpoint gets the latest report in desired format
   * @param format The desired format
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getLatestReport(
    format?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<JsonReportResponse>;
  public getLatestReport(
    format?: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<JsonReportResponse>>;
  public getLatestReport(
    format?: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<JsonReportResponse>>;
  public getLatestReport(
    format?: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (format !== undefined && format !== null) {
      queryParameters = queryParameters.set('format', <any>format);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*', 'application/json', 'text/html'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<JsonReportResponse>(
      'get',
      `${this.basePath}/api/v1/reports/latest`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Returns report in desired format if id exists
   * This endpoint gets reports in desired format
   * @param id The report id
   * @param format The desired format
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getReportByID(
    id: number,
    format?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<JsonReportResponse>;
  public getReportByID(
    id: number,
    format?: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<JsonReportResponse>>;
  public getReportByID(
    id: number,
    format?: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<JsonReportResponse>>;
  public getReportByID(
    id: number,
    format?: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling getReportByID.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (format !== undefined && format !== null) {
      queryParameters = queryParameters.set('format', <any>format);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*', 'application/json', 'text/html'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<JsonReportResponse>(
      'get',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Gets a list of article and statistic suggestions for a report
   * Gets a list of article suggestions for a given report id
   * @param id The report id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public getReportSuggestions(
    id: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<JsonReportSuggestionsResponse>;
  public getReportSuggestions(
    id: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<JsonReportSuggestionsResponse>>;
  public getReportSuggestions(
    id: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<JsonReportSuggestionsResponse>>;
  public getReportSuggestions(
    id: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling getReportSuggestions.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json', '*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<JsonReportSuggestionsResponse>(
      'get',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/suggestions`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Adds an article or statistic as a suggestion to a report
   * Adds an article or statistic as a suggestion to a report
   * @param id The report id
   * @param articleId
   * @param statId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public patchReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public patchReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public patchReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public patchReportSuggestions(
    id: number,
    articleId?: string,
    statId?: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling patchReportSuggestions.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (articleId !== undefined && articleId !== null) {
      queryParameters = queryParameters.set('articleId', <any>articleId);
    }
    if (statId !== undefined && statId !== null) {
      queryParameters = queryParameters.set('statId', <any>statId);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/suggestions`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Remove articles from report
   * This endpoint removes the articles specified in request body from the report
   * @param body
   * @param id The report id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public removeArticlesFromReport(
    body: Array<string>,
    id: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public removeArticlesFromReport(
    body: Array<string>,
    id: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public removeArticlesFromReport(
    body: Array<string>,
    id: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public removeArticlesFromReport(
    body: Array<string>,
    id: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling removeArticlesFromReport.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling removeArticlesFromReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/removeArticle`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Remove article from report
   * This endpoint removes the specified article from the report
   * @param id The report id
   * @param articleId The article id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public removeSingleArticlesFromReport(
    id: number,
    articleId: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public removeSingleArticlesFromReport(
    id: number,
    articleId: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public removeSingleArticlesFromReport(
    id: number,
    articleId: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public removeSingleArticlesFromReport(
    id: number,
    articleId: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling removeSingleArticlesFromReport.'
      );
    }

    if (articleId === null || articleId === undefined) {
      throw new Error(
        'Required parameter articleId was null or undefined when calling removeSingleArticlesFromReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/removeArticle/${encodeURIComponent(String(articleId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Remove statistic from report
   * This endpoint removes the specified statistic from the report
   * @param id The report id
   * @param statisticId The statistic id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public removeSingleStatFromReport(
    id: number,
    statisticId: string,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public removeSingleStatFromReport(
    id: number,
    statisticId: string,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public removeSingleStatFromReport(
    id: number,
    statisticId: string,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public removeSingleStatFromReport(
    id: number,
    statisticId: string,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling removeSingleStatFromReport.'
      );
    }

    if (statisticId === null || statisticId === undefined) {
      throw new Error(
        'Required parameter statisticId was null or undefined when calling removeSingleStatFromReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/removeStat/${encodeURIComponent(String(statisticId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Remove statistics from report
   * This endpoint removes the statistics specified in request body from the report
   * @param body
   * @param id The report id
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public removeStatsFromReport(
    body: Array<string>,
    id: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public removeStatsFromReport(
    body: Array<string>,
    id: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public removeStatsFromReport(
    body: Array<string>,
    id: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public removeStatsFromReport(
    body: Array<string>,
    id: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling removeStatsFromReport.'
      );
    }

    if (id === null || id === undefined) {
      throw new Error(
        'Required parameter id was null or undefined when calling removeStatsFromReport.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/api/v1/reports/${encodeURIComponent(String(id))}/removeStat`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Search reports by date range and type
   * This endpoint searches for reports based on date range and report type.
   * @param type Type of report
   * @param dateStart Start date (YYYY-MM-DD)
   * @param dateEnd End date (YYYY-MM-DD)
   * @param page The page of the search. The offset of data is determined by \&quot;limit\&quot;
   * @param limit The limit of results returned by this api
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public searchReports(
    type: string,
    dateStart?: string,
    dateEnd?: string,
    page?: number,
    limit?: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<SearchReportResponse>;
  public searchReports(
    type: string,
    dateStart?: string,
    dateEnd?: string,
    page?: number,
    limit?: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<SearchReportResponse>>;
  public searchReports(
    type: string,
    dateStart?: string,
    dateEnd?: string,
    page?: number,
    limit?: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<SearchReportResponse>>;
  public searchReports(
    type: string,
    dateStart?: string,
    dateEnd?: string,
    page?: number,
    limit?: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (type === null || type === undefined) {
      throw new Error(
        'Required parameter type was null or undefined when calling searchReports.'
      );
    }

    let queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    if (dateStart !== undefined && dateStart !== null) {
      queryParameters = queryParameters.set('date-start', <any>dateStart);
    }
    if (dateEnd !== undefined && dateEnd !== null) {
      queryParameters = queryParameters.set('date-end', <any>dateEnd);
    }
    if (type !== undefined && type !== null) {
      queryParameters = queryParameters.set('type', <any>type);
    }
    if (page !== undefined && page !== null) {
      queryParameters = queryParameters.set('page', <any>page);
    }
    if (limit !== undefined && limit !== null) {
      queryParameters = queryParameters.set('limit', <any>limit);
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['*/*', 'application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<SearchReportResponse>(
      'get',
      `${this.basePath}/api/v1/reports/search`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}
