// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  UserFacingDiagnosticsFeature,
  Features,
  MediaDiagnosticChangedEventArgs,
  NetworkDiagnosticChangedEventArgs
} from '@azure/communication-calling';
import { CallCommon } from '@internal/calling-stateful-client';
import { EventEmitter } from 'events';
import { MediaDiagnosticChangedEvent, NetworkDiagnosticChangedEvent } from './CallAdapter';

/**
 * @private
 */
export class DiagnosticsForwarder {
  private _diagnostics: UserFacingDiagnosticsFeature;
  private _emitter: EventEmitter;

  constructor(emitter: EventEmitter, call: CallCommon) {
    this._diagnostics = call.feature(Features.UserFacingDiagnostics);
    this._emitter = emitter;
    this.subscribe();
  }

  public unsubscribe = (): void => {
    this._diagnostics.network.off('diagnosticChanged', this.networkDiagnosticsChanged.bind(this));
    this._diagnostics.media.off('diagnosticChanged', this.mediaDiagnosticsChanged.bind(this));
  };

  private subscribe(): void {
    this._diagnostics.network.on('diagnosticChanged', this.networkDiagnosticsChanged.bind(this));
    this._diagnostics.media.on('diagnosticChanged', this.mediaDiagnosticsChanged.bind(this));
  }

  private networkDiagnosticsChanged(args: NetworkDiagnosticChangedEventArgs): void {
    const event: NetworkDiagnosticChangedEvent = {
      type: 'network',
      ...args
    };
    this._emitter.emit('diagnosticChanged', event);
  }

  private mediaDiagnosticsChanged(args: MediaDiagnosticChangedEventArgs): void {
    const event: MediaDiagnosticChangedEvent = {
      type: 'media',
      ...args
    };
    this._emitter.emit('diagnosticChanged', event);
  }
}
