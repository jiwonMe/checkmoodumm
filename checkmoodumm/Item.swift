//
//  Item.swift
//  checkmoodumm
//
//  Created by Jiwon Park on 3/11/25.
//

import Foundation
import SwiftData

@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
